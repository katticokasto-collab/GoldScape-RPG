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
        // WOODCUTTING TREES
        this.createResourceNode('Tree', new Vector3(5, 5, 0), 'logs', '#228b22');
        this.createResourceNode('Tree', new Vector3(10, 5, 0), 'logs', '#228b22');
        this.createResourceNode('Oak Tree', new Vector3(15, 10, 0), 'oak_logs', '#1f6b1f');
        this.createResourceNode('Willow Tree', new Vector3(-8, 12, 0), 'willow_logs', '#2b7a2b');

        // MINING ROCKS
        this.createResourceNode('Copper Rock', new Vector3(5, -5, 0), 'copper_ore', '#b87333');
        this.createResourceNode('Tin Rock', new Vector3(10, -10, 0), 'tin_ore', '#c0c0c0');
        this.createResourceNode('Iron Rock', new Vector3(15, -5, 0), 'iron_ore', '#808080');
        this.createResourceNode('Coal Rock', new Vector3(-5, -15, 0), 'coal', '#2f2f2f');

        // FISHING SPOTS
        this.createResourceNode('Fish Spot', new Vector3(-10, 8, 0), 'shrimp', '#ff69b4');
        this.createResourceNode('Fish Spot', new Vector3(-20, 5, 0), 'anchovy', '#4169e1');

        // Fire Pit (non-resource object)
        this.createObject('Fire Pit', new Vector3(-10, 0, 0), 'object', {
            radius: 0.5,
            color: '#ff4500'
        });
    }

    /**
     * Create a resource node
     */
    createResourceNode(name, position, resourceType, color) {
        const resourceDef = RESOURCE_DEFINITIONS[resourceType];
        if (!resourceDef) {
            console.warn(`Unknown resource type: ${resourceType}`);
            return;
        }

        const id = `obj_${this.objectIdCounter++}`;
        const obj = new WorldObject(id, resourceDef.name, position, 'resource', {
            radius: 0.3,
            color: color,
            ...resourceDef,
            depleted: false,
            respawnTime: 0
        });
        this.objects.set(id, obj);
        return obj;
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
        // Update resource respawn timers
        for (const obj of this.objects.values()) {
            if (obj.type === 'resource' && obj.properties.depleted) {
                obj.properties.respawnTime -= deltaTime;
                if (obj.properties.respawnTime <= 0) {
                    obj.properties.depleted = false;
                    obj.properties.respawnTime = 0;
                }
            }
        }
    }
}
