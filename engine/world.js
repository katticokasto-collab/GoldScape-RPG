/**
 * World system - manages terrain, objects, NPCs, and resources
 */

class WorldObject {
    constructor(id, name, position, type, properties = {}) {
        this.id = id;
        this.name = name;
        this.position = position.clone();
        this.type = type; // 'resource', 'npc', 'object', 'terrain'
        this.properties = properties;
        this.radius = properties.radius || 0.5;
        this.color = properties.color || '#8b7355';
    }

    /**
     * Check if point is within object bounds
     */
    contains(point) {
        return this.position.distance(point) < this.radius;
    }
}

class World {
    constructor() {
        this.objects = new Map();
        this.objectIdCounter = 0;
        this.terrain = new Map();
        this.initialize();
    }

    /**
     * Initialize world with starter objects
     */
    initialize() {
        // Spawn some starter resources
        this.createObject('Tree Lv.1', new Vector3(5, 5, 0), 'resource', {
            radius: 0.3,
            color: '#228b22',
            resourceType: 'logs',
            healthPoints: 10
        });

        this.createObject('Tree Lv.1', new Vector3(10, 5, 0), 'resource', {
            radius: 0.3,
            color: '#228b22',
            resourceType: 'logs',
            healthPoints: 10
        });

        this.createObject('Rock', new Vector3(5, -5, 0), 'resource', {
            radius: 0.4,
            color: '#808080',
            resourceType: 'ore',
            healthPoints: 20
        });

        this.createObject('Fire Pit', new Vector3(-10, 0, 0), 'object', {
            radius: 0.5,
            color: '#ff4500'
        });
    }

    /**
     * Create a world object
     */
    createObject(name, position, type, properties = {}) {
        const id = `obj_${this.objectIdCounter++}`;
        const obj = new WorldObject(id, name, position, type, properties);
        this.objects.set(id, obj);
        return obj;
    }

    /**
     * Get object at world position (for clicking)
     */
    getObjectAtPosition(position) {
        for (const obj of this.objects.values()) {
            if (obj.contains(position)) {
                return obj;
            }
        }
        return null;
    }

    /**
     * Get all objects in a region
     */
    getObjectsInRegion(center, radius) {
        const results = [];
        for (const obj of this.objects.values()) {
            if (center.distance(obj.position) < radius) {
                results.push(obj);
            }
        }
        return results;
    }

    /**
     * Update world state
     */
    update(deltaTime) {
        // TODO: Respawn resources, update NPCs, etc
    }
}
