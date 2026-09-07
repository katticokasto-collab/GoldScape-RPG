/**
 * Camera system for isometric 3D view
 */

class IsometricCamera {
    constructor(canvas) {
        this.canvas = canvas;
        this.position = new Vector3(0, 0, 50);
        this.target = new Vector3(0, 0, 0);
        this.distance = 50;
        this.pitch = Math.PI / 4; // 45 degrees isometric view
        this.yaw = Math.PI / 4;   // 45 degrees rotation
    }

    /**
     * Follow target position
     */
    follow(targetPos, smoothing = 0.1) {
        this.target.x += (targetPos.x - this.target.x) * smoothing;
        this.target.y += (targetPos.y - this.target.y) * smoothing;
        this.target.z += (targetPos.z - this.target.z) * smoothing;

        // Position camera around target
        this.position.x = this.target.x + this.distance * Math.cos(this.yaw) * Math.cos(this.pitch);
        this.position.y = this.target.y + this.distance * Math.sin(this.yaw) * Math.cos(this.pitch);
        this.position.z = this.target.z + this.distance * Math.sin(this.pitch);
    }

    /**
     * Get camera view matrix (simplified 2D projection for canvas rendering)
     */
    getViewMatrix() {
        return {
            position: this.position.clone(),
            target: this.target.clone(),
            distance: this.distance
        };
    }

    /**
     * Zoom camera in/out
     */
    zoom(delta) {
        this.distance = clamp(this.distance + delta, 20, 100);
    }
}
