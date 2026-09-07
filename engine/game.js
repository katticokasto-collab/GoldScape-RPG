/**
 * Main game controller and loop
 */

class GoldScapeRPG {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.camera = new IsometricCamera(this.canvas);
        this.world = new World();
        this.player = new Player(new Vector3(0, 0, 0));
        
        // New systems
        this.skillsManager = new SkillsManager();
        this.inventory = new Inventory(28);
        this.harvestingManager = new HarvestingManager(this.skillsManager, this.inventory);
        
        this.inputHandler = new InputHandler(this.canvas, this.renderer, this);

        this.running = false;
        this.lastFrameTime = Date.now();
        this.frameCount = 0;
        this.fps = 0;

        this.init();
    }

    /**
     * Initialize game
     */
    init() {
        console.log('🎮 GoldScape RPG v0.2.0 - Harvesting System initialized');
        console.log('✓ No telemetry, no analytics, 100% local');
        this.start();
    }

    /**
     * Start game loop
     */
    start() {
        this.running = true;
        this.gameLoop();
    }

    /**
     * Main game loop - 60 FPS target
     */
    gameLoop = () => {
        const now = Date.now();
        const deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        // Update
        this.update(deltaTime);

        // Render
        this.render();

        // Calculate FPS
        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(1 / deltaTime);
        }

        if (this.running) {
            requestAnimationFrame(this.gameLoop);
        }
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        this.player.update(deltaTime);
        this.world.update(deltaTime);
        this.camera.follow(this.player.position);
        
        // Update harvesting
        this.harvestingManager.update(deltaTime);
        
        // Update UI
        this.updateUI();
    }

    /**
     * Render frame
     */
    render() {
        this.renderer.clear();
        this.renderer.drawGrid(this.camera.target);

        // Draw world objects sorted by position (painter's algorithm for depth)
        const objectsToRender = Array.from(this.world.objects.values())
            .sort((a, b) => (a.position.y + a.position.x) - (b.position.y + b.position.x));

        objectsToRender.forEach(obj => {
            // Highlight depleted resources
            let color = obj.color;
            if (obj.properties.depleted) {
                color = '#4a4a4a';
            }
            
            this.renderer.drawCube(obj.position, 0.8, color);
            this.renderer.drawLabel(obj.position, obj.name, '#ffffff', 1);
        });

        // Draw player
        this.renderer.drawSphere(this.player.position, this.player.radius, '#00ff00');
        this.renderer.drawLabel(this.player.position, 'Player', '#00ff00', 1);

        // Draw harvesting progress indicator
        if (this.harvestingManager.isHarvesting()) {
            const progress = this.harvestingManager.getProgress();
            const resource = this.harvestingManager.getCurrentResource();
            if (resource) {
                // Draw progress bar above resource
                const iso = worldToIsometric(resource.position.x, resource.position.y, resource.position.z + 1);
                const screenX = this.renderer.centerX + iso.x * this.renderer.scale;
                const screenY = this.renderer.centerY + iso.y * this.renderer.scale;
                
                // Progress bar
                this.renderer.ctx.fillStyle = '#333';
                this.renderer.ctx.fillRect(screenX - 20, screenY - 30, 40, 6);
                this.renderer.ctx.fillStyle = '#00ff00';
                this.renderer.ctx.fillRect(screenX - 20, screenY - 30, 40 * progress, 6);
                this.renderer.ctx.strokeStyle = '#000';
                this.renderer.ctx.lineWidth = 1;
                this.renderer.ctx.strokeRect(screenX - 20, screenY - 30, 40, 6);
            }
        }

        // Draw debug info
        this.drawDebugInfo();
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update player stats
        document.getElementById('hpValue').textContent = `${this.player.hp}/${this.player.maxHp}`;
        document.getElementById('levelValue').textContent = this.skillsManager.getTotalLevel();
        
        // Update inventory display
        this.updateInventoryUI();
        
        // Update action bar
        this.updateActionBarUI();
    }

    /**
     * Update inventory UI
     */
    updateInventoryUI() {
        const inventoryList = document.getElementById('inventoryList');
        const items = this.inventory.getFormattedItems();
        
        if (items.length === 0) {
            inventoryList.innerHTML = '<div style="color: #666; font-size: 12px;">Empty</div>';
            return;
        }
        
        inventoryList.innerHTML = items.map(item => `
            <div class="inventoryItem">
                <span class="itemName">${item.name}</span>
                <span class="itemQuantity">x${item.quantity}</span>
            </div>
        `).join('');
    }

    /**
     * Update action bar UI
     */
    updateActionBarUI() {
        const actionBar = document.getElementById('actionBar');
        
        if (this.harvestingManager.isHarvesting()) {
            const resource = this.harvestingManager.getCurrentResource();
            const progress = this.harvestingManager.getProgress();
            
            document.getElementById('actionLabel').textContent = `Harvesting ${resource.name}...`;
            document.getElementById('progressFill').style.width = (progress * 100) + '%';
            document.getElementById('progressFill').textContent = Math.round(progress * 100) + '%';
            document.getElementById('progressText').textContent = `${Math.round(progress * 100)}%`;
            
            actionBar.classList.add('active');
        } else {
            actionBar.classList.remove('active');
        }
    }

    /**
     * Draw debug information
     */
    drawDebugInfo() {
        let debugHTML = `
            <div id="debugInfo">
                <strong>GoldScape RPG Debug</strong><br>
                Position: ${this.player.position.x.toFixed(1)}, ${this.player.position.y.toFixed(1)}<br>
                Moving: ${this.player.isMoving ? 'Yes' : 'No'}<br>
                Harvesting: ${this.harvestingManager.isHarvesting() ? 'Yes' : 'No'}<br>
                Inventory: ${this.inventory.getAllItems().length}/${this.inventory.maxSlots}<br>
                FPS: ${this.fps}<br>
                Objects: ${this.world.objects.size}
            </div>
        `;
        let debugDiv = document.getElementById('debugInfo');
        if (!debugDiv) {
            debugDiv = document.createElement('div');
            debugDiv.id = 'debugInfo';
            document.getElementById('ui').appendChild(debugDiv);
        }
        debugDiv.innerHTML = debugHTML.trim();
    }

    /**
     * Get context menu options for object
     */
    getContextMenuOptions(obj) {
        const options = [];

        if (obj.type === 'resource') {
            // Check if resource is depleted
            if (obj.properties.depleted) {
                options.push({
                    label: `Depleted (respawn in ${obj.properties.respawnTime?.toFixed(1)}s)`,
                    action: () => { /* disabled */ }
                });
            } else {
                const skillId = obj.properties.skillRequired;
                const skill = this.skillsManager.getSkill(skillId);
                options.push({
                    label: `${obj.properties.name} (Level ${obj.properties.skillLevel})`,
                    action: () => this.startHarvesting(obj)
                });
            }
        } else if (obj.type === 'npc') {
            options.push({
                label: `Talk to ${obj.name}`,
                action: () => this.player.moveTo(obj.position)
            });
        }

        options.push({
            label: `Examine ${obj.name}`,
            action: () => console.log(`Examined: ${obj.name}`, obj)
        });

        return options;
    }

    /**
     * Start harvesting a resource
     */
    startHarvesting(resourceObj) {
        // First, move player to resource if not in range
        const distance = this.player.position.distance(resourceObj.position);
        if (distance > 1.5) {
            this.player.moveTo(resourceObj.position);
            // We'll need to start harvesting once player arrives
            // For now, queue it
            this.pendingHarvest = resourceObj;
            console.log('Moving to resource...');
        } else {
            // Start harvesting immediately
            const success = this.harvestingManager.startHarvest(resourceObj, this.player);
            if (success) {
                console.log('Started harvesting:', resourceObj.name);
            } else {
                console.warn('Cannot harvest:', resourceObj.name);
            }
            this.pendingHarvest = null;
        }
    }

    /**
     * Get object at position (for interaction)
     */
    getObjectAtPosition(position) {
        return this.world.getObjectAtPosition(position);
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GoldScapeRPG();
});
