/**
 * Input handler for Point-and-Click controls
 * Manages mouse clicks, camera manipulation, and context menus
 */

class InputHandler {
    constructor(canvas, renderer, game) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.game = game;
        this.contextMenu = document.getElementById('contextMenu');
        this.contextMenuContent = document.getElementById('contextMenuContent');
        this.lastClickTime = 0;
        this.doubleClickDelay = 300;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mouse click handling
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
        this.canvas.addEventListener('contextmenu', (e) => this.onContextMenu(e));
        this.canvas.addEventListener('dblclick', (e) => this.onDoubleClick(e));
        this.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e));

        // Close context menu when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (e.target !== this.canvas && !this.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
        });
    }

    /**
     * Handle left mouse click - movement and interaction
     */
    onCanvasClick(event) {
        event.preventDefault();

        const rect = this.canvas.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;

        // Convert screen coordinates to world coordinates
        const worldPos = this.renderer.screenToWorld(screenX, screenY);

        // Check for object interaction first
        const clickedObject = this.game.getObjectAtPosition(worldPos);
        if (clickedObject) {
            this.showContextMenu(event.clientX, event.clientY, clickedObject);
        } else {
            // Move player
            this.game.player.moveTo(new Vector3(worldPos.x, worldPos.y, 0));
            this.hideContextMenu();
        }
    }

    /**
     * Handle right mouse click - show context menu
     */
    onContextMenu(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;

        const worldPos = this.renderer.screenToWorld(screenX, screenY);
        const clickedObject = this.game.getObjectAtPosition(worldPos);

        if (clickedObject) {
            this.showContextMenu(event.clientX, event.clientY, clickedObject);
        }
    }

    /**
     * Handle double click - quick actions
     */
    onDoubleClick(event) {
        // TODO: Implement quick actions (use default skill, etc)
    }

    /**
     * Handle mouse wheel - zoom camera
     */
    onMouseWheel(event) {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 2 : -2;
        this.game.camera.zoom(delta);
    }

    /**
     * Display context menu for object interaction
     */
    showContextMenu(clientX, clientY, targetObject) {
        this.contextMenuContent.innerHTML = '';

        const options = this.game.getContextMenuOptions(targetObject);
        options.forEach(option => {
            const item = document.createElement('div');
            item.className = 'contextMenuItem';
            item.textContent = option.label;
            item.onclick = () => {
                option.action();
                this.hideContextMenu();
            };
            this.contextMenuContent.appendChild(item);
        });

        this.contextMenu.style.left = clientX + 'px';
        this.contextMenu.style.top = clientY + 'px';
        this.contextMenu.style.display = 'block';
    }

    /**
     * Hide context menu
     */
    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }
}
