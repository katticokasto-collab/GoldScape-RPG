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
        console.log('🎮 GoldScape RPG v0.1.0 initialized');
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
            this.renderer.drawCube(obj.position, 0.8, obj.color);
            this.renderer.drawLabel(obj.position, obj.name, '#ffffff', 1);
        });

        // Draw player
        this.renderer.drawSphere(this.player.position, this.player.radius, '#00ff00');
        this.renderer.drawLabel(this.player.position, 'Player', '#00ff00', 1);

        // Draw debug info
        this.drawDebugInfo();
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
            options.push({
                label: `Harvest ${obj.properties.resourceType}`,
                action: () => this.player.moveTo(obj.position)
            });
        } else if (obj.type === 'npc') {
            options.push({
                label: `Talk to ${obj.name}`,
                action: () => this.player.moveTo(obj.position)
            });
        }

        options.push({
            label: `Examine ${obj.name}`,
            action: () => console.log(`Examined: ${obj.name}`)
        });

        return options;
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
