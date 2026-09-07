/**
 * Player character system
 */

class Player {
    constructor(startPos = new Vector3(0, 0, 0)) {
        this.position = startPos.clone();
        this.targetPos = startPos.clone();
        this.direction = new Vector3(1, 0, 0);
        this.speed = 5; // Units per second
        this.isMoving = false;
        this.radius = 0.5;

        // Stats
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 100;
        this.maxMp = 100;
        this.experience = 0;
        this.level = 1;

        // Inventory and equipment
        this.inventory = [];
        this.equipment = {};
        this.skills = {};
    }

    /**
     * Move player to target position
     */
    moveTo(targetPos) {
        this.targetPos = targetPos.clone();
        this.isMoving = true;
    }

    /**
     * Update player position (called every frame)
     */
    update(deltaTime) {
        if (!this.isMoving) return;

        const distance = this.position.distance(this.targetPos);
        const moveDistance = this.speed * deltaTime;

        if (distance < moveDistance) {
            this.position = this.targetPos.clone();
            this.isMoving = false;
        } else {
            const direction = this.targetPos.subtract(this.position).normalize();
            this.position = this.position.add(direction.multiply(moveDistance));
            this.direction = direction;
        }
    }

    /**
     * Add experience points
     */
    addExperience(amount) {
        this.experience += amount;
        // TODO: Implement leveling system
    }

    /**
     * Heal player
     */
    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    /**
     * Damage player
     */
    takeDamage(amount) {
        this.hp = Math.max(this.hp - amount, 0);
    }
}
