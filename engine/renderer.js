/**
 * Low-poly 3D renderer using Canvas 2D (isometric projection)
 * Handles drawing of world objects, terrain, and UI overlays
 */

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = window.innerWidth;
        this.height = canvas.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.scale = 40; // Pixels per world unit
        
        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    /**
     * Clear screen with background color
     */
    clear() {
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Draw a 3D cube in isometric view
     */
    drawCube(worldPos, size = 1, color = '#8b7355') {
        const iso = worldToIsometric(worldPos.x, worldPos.y, worldPos.z);
        const screenX = this.centerX + iso.x * this.scale;
        const screenY = this.centerY + iso.y * this.scale;
        const s = size * this.scale / 2;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX - s, screenY);
        this.ctx.lineTo(screenX, screenY - s);
        this.ctx.lineTo(screenX + s, screenY);
        this.ctx.lineTo(screenX, screenY + s);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    /**
     * Draw a sphere (player, NPC)
     */
    drawSphere(worldPos, radius = 0.5, color = '#00ff00') {
        const iso = worldToIsometric(worldPos.x, worldPos.y, worldPos.z);
        const screenX = this.centerX + iso.x * this.scale;
        const screenY = this.centerY + iso.y * this.scale;
        const screenRadius = radius * this.scale;

        // Draw sphere
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(screenX - screenRadius / 3, screenY - screenRadius / 3, screenRadius / 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    /**
     * Draw grid for terrain reference
     */
    drawGrid(cameraPos, size = 10) {
        const gridSize = 20;
        const gridExtent = 15;
        const startX = Math.floor(cameraPos.x) - gridExtent;
        const startY = Math.floor(cameraPos.y) - gridExtent;

        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        this.ctx.lineWidth = 1;

        for (let x = startX; x < startX + gridExtent * 2; x++) {
            for (let y = startY; y < startY + gridExtent * 2; y++) {
                const iso = worldToIsometric(x * gridSize, y * gridSize, 0);
                const screenX = this.centerX + iso.x * this.scale;
                const screenY = this.centerY + iso.y * this.scale;

                if (screenX > 0 && screenX < this.width && screenY > 0 && screenY < this.height) {
                    this.ctx.fillStyle = 'rgba(150, 100, 50, 0.1)';
                    const size = this.scale * gridSize / 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX - size, screenY);
                    this.ctx.lineTo(screenX, screenY - size);
                    this.ctx.lineTo(screenX + size, screenY);
                    this.ctx.lineTo(screenX, screenY + size);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
            }
        }
    }

    /**
     * Draw text label (player name, resource info)
     */
    drawLabel(worldPos, text, color = '#ffffff', offset = 0) {
        const iso = worldToIsometric(worldPos.x, worldPos.y, worldPos.z + offset);
        const screenX = this.centerX + iso.x * this.scale;
        const screenY = this.centerY + iso.y * this.scale;

        this.ctx.fillStyle = color;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, screenX, screenY);
    }

    /**
     * Convert screen coordinates to world coordinates for click detection
     */
    screenToWorld(screenX, screenY) {
        const relX = screenX - this.centerX;
        const relY = screenY - this.centerY;
        const isoX = relX / this.scale;
        const isoY = relY / this.scale;
        return isometricToWorld(isoX, isoY);
    }
}
