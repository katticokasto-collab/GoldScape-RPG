/**
 * Resource definitions for harvesting
 */

const RESOURCE_DEFINITIONS = {
    // Woodcutting Resources
    logs: {
        name: 'Logs',
        itemYield: 'logs',
        itemName: 'Logs',
        itemWeight: 0,
        itemValue: 0,
        yieldQuantity: 1,
        skillRequired: 'woodcutting',
        skillLevel: 1,
        xpPerHarvest: 25,
        healthPoints: 10
    },
    oak_logs: {
        name: 'Oak Logs',
        itemYield: 'oak_logs',
        itemName: 'Oak Logs',
        itemWeight: 0,
        itemValue: 5,
        yieldQuantity: 1,
        skillRequired: 'woodcutting',
        skillLevel: 15,
        xpPerHarvest: 38,
        healthPoints: 15
    },
    willow_logs: {
        name: 'Willow Logs',
        itemYield: 'willow_logs',
        itemName: 'Willow Logs',
        itemWeight: 0,
        itemValue: 10,
        yieldQuantity: 1,
        skillRequired: 'woodcutting',
        skillLevel: 30,
        xpPerHarvest: 67,
        healthPoints: 20
    },

    // Mining Resources
    copper_ore: {
        name: 'Copper Ore',
        itemYield: 'copper_ore',
        itemName: 'Copper Ore',
        itemWeight: 1,
        itemValue: 10,
        yieldQuantity: 1,
        skillRequired: 'mining',
        skillLevel: 1,
        xpPerHarvest: 17.5,
        healthPoints: 20
    },
    tin_ore: {
        name: 'Tin Ore',
        itemYield: 'tin_ore',
        itemName: 'Tin Ore',
        itemWeight: 1,
        itemValue: 10,
        yieldQuantity: 1,
        skillRequired: 'mining',
        skillLevel: 1,
        xpPerHarvest: 17.5,
        healthPoints: 20
    },
    iron_ore: {
        name: 'Iron Ore',
        itemYield: 'iron_ore',
        itemName: 'Iron Ore',
        itemWeight: 2,
        itemValue: 40,
        yieldQuantity: 1,
        skillRequired: 'mining',
        skillLevel: 15,
        xpPerHarvest: 35,
        healthPoints: 40
    },
    coal: {
        name: 'Coal',
        itemYield: 'coal',
        itemName: 'Coal',
        itemWeight: 1,
        itemValue: 50,
        yieldQuantity: 1,
        skillRequired: 'mining',
        skillLevel: 30,
        xpPerHarvest: 50,
        healthPoints: 50
    },

    // Fishing Resources
    shrimp: {
        name: 'Shrimp',
        itemYield: 'shrimp',
        itemName: 'Shrimp',
        itemWeight: 0,
        itemValue: 5,
        yieldQuantity: 1,
        skillRequired: 'fishing',
        skillLevel: 1,
        xpPerHarvest: 10,
        healthPoints: 10
    },
    anchovy: {
        name: 'Anchovy',
        itemYield: 'anchovy',
        itemName: 'Anchovy',
        itemWeight: 0,
        itemValue: 10,
        yieldQuantity: 1,
        skillRequired: 'fishing',
        skillLevel: 10,
        xpPerHarvest: 40,
        healthPoints: 10
    }
};

/**
 * Create a resource object with full properties
 */
function createResource(name, position, resourceType) {
    const def = RESOURCE_DEFINITIONS[resourceType];
    if (!def) {
        console.warn(`Unknown resource type: ${resourceType}`);
        return null;
    }

    return {
        name: def.name,
        position: position.clone(),
        type: 'resource',
        resourceType: resourceType,
        properties: {
            radius: 0.3,
            color: getResourceColor(resourceType),
            ...def,
            depleted: false,
            respawnTime: 0
        }
    };
}

/**
 * Get color for resource type (for rendering)
 */
function getResourceColor(resourceType) {
    const colorMap = {
        // Woodcutting
        logs: '#228b22',
        oak_logs: '#1f6b1f',
        willow_logs: '#2b7a2b',
        // Mining
        copper_ore: '#b87333',
        tin_ore: '#c0c0c0',
        iron_ore: '#808080',
        coal: '#2f2f2f',
        // Fishing
        shrimp: '#ff69b4',
        anchovy: '#4169e1'
    };
    return colorMap[resourceType] || '#8b7355';
}
