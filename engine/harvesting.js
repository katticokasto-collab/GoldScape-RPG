/**
 * Harvesting system - handles resource gathering with action queues
 */

class HarvestAction {
    constructor(resourceObj, player, skillManager, inventory) {
        this.resource = resourceObj;
        this.player = player;
        this.skillManager = skillManager;
        this.inventory = inventory;
        
        this.isActive = false;
        this.elapsedTime = 0;
        this.actionDuration = 2.0; // Seconds per action
        this.resourceRespawnTime = 5.0; // Seconds until respawn
        this.harvestCount = 0;
        this.maxHarvests = 5; // Resource dies after this many hits
    }

    /**
     * Start harvesting action
     */
    start() {
        this.isActive = true;
        this.elapsedTime = 0;
        
        // Determine which skill and item based on resource type
        const skillId = this.resource.properties.skillRequired;
        const itemId = this.resource.properties.itemYield;
        
        const skill = this.skillManager.getSkill(skillId);
        this.skillRequirement = skill ? skill.level : 1;
    }

    /**
     * Update harvest action (called each frame)
     */
    update(deltaTime) {
        if (!this.isActive) return false;

        this.elapsedTime += deltaTime;

        // Check if action is complete
        if (this.elapsedTime >= this.actionDuration) {
            this.complete();
            return false; // Action finished
        }

        return true; // Action still in progress
    }

    /**
     * Complete one harvest action
     */
    complete() {
        this.harvestCount++;
        this.elapsedTime = 0;

        // Award resources and experience
        this.awardLoot();
        this.awardExperience();

        // Check if resource is depleted
        if (this.harvestCount >= this.maxHarvests) {
            this.deplete();
            return false; // Resource exhausted
        }

        return true; // Continue harvesting
    }

    /**
     * Award loot from harvest
     */
    awardLoot() {
        const itemId = this.resource.properties.itemYield;
        const itemName = this.resource.properties.itemName || this.resource.name;
        const quantity = this.resource.properties.yieldQuantity || 1;

        const item = new Item(itemName, itemId, quantity, {
            stackable: true,
            weight: this.resource.properties.itemWeight || 0,
            value: this.resource.properties.itemValue || 0
        });

        const success = this.inventory.addItem(item);
        if (!success) {
            console.warn('Inventory full! Drop item:', itemName);
        }
    }

    /**
     * Award experience
     */
    awardExperience() {
        const skillId = this.resource.properties.skillRequired;
        const xpAmount = this.resource.properties.xpPerHarvest || 25;
        this.skillManager.addExperience(skillId, xpAmount);
    }

    /**
     * Deplete resource
     */
    deplete() {
        this.isActive = false;
        this.resource.properties.depleted = true;
        this.resource.properties.respawnTime = this.resourceRespawnTime;
    }

    /**
     * Get progress (0-1)
     */
    getProgress() {
        return Math.min(this.elapsedTime / this.actionDuration, 1);
    }
}

class HarvestingManager {
    constructor(skillManager, inventory) {
        this.skillManager = skillManager;
        this.inventory = inventory;
        this.currentAction = null;
        this.actionQueue = [];
    }

    /**
     * Start harvesting a resource
     */
    startHarvest(resourceObj, player) {
        // Stop current action if any
        this.currentAction = null;
        this.actionQueue = [];

        // Check if player is in range (1 unit)
        const distance = player.position.distance(resourceObj.position);
        if (distance > 1.5) {
            console.warn('Too far from resource');
            return false;
        }

        // Check skill requirement
        const skillId = resourceObj.properties.skillRequired;
        const skill = this.skillManager.getSkill(skillId);
        if (!skill || skill.level < (resourceObj.properties.skillLevel || 1)) {
            console.warn(`Need level ${resourceObj.properties.skillLevel} in ${skill?.name}`);
            return false;
        }

        // Create and start action
        this.currentAction = new HarvestAction(resourceObj, player, this.skillManager, this.inventory);
        this.currentAction.start();
        return true;
    }

    /**
     * Stop current harvesting
     */
    stopHarvest() {
        this.currentAction = null;
    }

    /**
     * Update harvesting (called each frame)
     */
    update(deltaTime) {
        if (!this.currentAction) return;

        const stillActive = this.currentAction.update(deltaTime);
        if (!stillActive) {
            // Action completed or resource exhausted
            const action = this.currentAction;
            this.currentAction = null;

            // Check if we should continue harvesting
            if (action.harvestCount < action.maxHarvests) {
                // Start next action automatically
                action.elapsedTime = 0;
                action.isActive = true;
                this.currentAction = action;
            }
        }
    }

    /**
     * Get current action progress (0-1)
     */
    getProgress() {
        return this.currentAction ? this.currentAction.getProgress() : 0;
    }

    /**
     * Is player harvesting?
     */
    isHarvesting() {
        return this.currentAction !== null && this.currentAction.isActive;
    }

    /**
     * Get current resource being harvested
     */
    getCurrentResource() {
        return this.currentAction ? this.currentAction.resource : null;
    }
}
