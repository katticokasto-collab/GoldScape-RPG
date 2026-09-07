/**
 * Mathematical utilities for the GoldScape RPG engine
 * Includes vector operations, isometric conversions, and collision detection
 */

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiply(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    distance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector3(0, 0, 0);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
}

/**
 * Converts 3D world coordinates to 2D isometric screen coordinates
 */
function worldToIsometric(x, y, z) {
    const isoX = (x - y) * Math.cos(Math.PI / 6);
    const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
    return { x: isoX, y: isoY };
}

/**
 * Converts 2D isometric screen coordinates back to 3D world coordinates
 * Assumes z = 0 for ground level
 */
function isometricToWorld(isoX, isoY) {
    const x = (isoX / Math.cos(Math.PI / 6) + isoY / Math.sin(Math.PI / 6)) / 2;
    const y = (isoY / Math.sin(Math.PI / 6) - isoX / Math.cos(Math.PI / 6)) / 2;
    return { x, y, z: 0 };
}

/**
 * Calculates distance between two 3D points
 */
function distance3D(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Clamps a value between min and max
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
