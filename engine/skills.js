/**
 * Skills system - manages player abilities, levels, and experience
 */

class Skill {
    constructor(name, id, startLevel = 1) {
        this.name = name;
        this.id = id;
        this.level = startLevel;
        this.experience = 0;
        this.nextLevelXP = this.calculateNextLevelXP(startLevel);
    }

    /**
     * Calculate XP needed to reach next level
     * OSRS-like exponential scaling
     */
    calculateNextLevelXP(level) {
        if (level >= 99) return Infinity;
        // Simplified XP curve (OSRS uses a table)
        return Math.floor(Math.pow(level, 3) * 10 + level * 100);
    }

    /**
     * Add experience to skill
     */
    addExperience(amount) {
        this.experience += amount;
        
        // Check for level ups
        while (this.experience >= this.nextLevelXP && this.level < 99) {
            this.experience -= this.nextLevelXP;
            this.level++;
            this.nextLevelXP = this.calculateNextLevelXP(this.level);
            return true; // Level up!
        }
        return false;
    }

    /**
     * Get progress to next level (0-1)
     */
    getProgress() {
        return Math.min(this.experience / this.nextLevelXP, 1);
    }
}

class SkillsManager {
    constructor() {
        this.skills = new Map();
        this.initialize();
    }

    /**
     * Initialize all skills
     */
    initialize() {
        const skillList = [
            { name: 'Woodcutting', id: 'woodcutting' },
            { name: 'Mining', id: 'mining' },
            { name: 'Fishing', id: 'fishing' },
            { name: 'Cooking', id: 'cooking' },
            { name: 'Crafting', id: 'crafting' },
            { name: 'Smithing', id: 'smithing' },
            { name: 'Attack', id: 'attack' },
            { name: 'Strength', id: 'strength' },
            { name: 'Defence', id: 'defence' },
            { name: 'Prayer', id: 'prayer' },
            { name: 'Magic', id: 'magic' },
            { name: 'Runecrafting', id: 'runecrafting' }
        ];

        skillList.forEach(skill => {
            this.skills.set(skill.id, new Skill(skill.name, skill.id));
        });
    }

    /**
     * Get skill by ID
     */
    getSkill(skillId) {
        return this.skills.get(skillId);
    }

    /**
     * Get all skills
     */
    getAllSkills() {
        return Array.from(this.skills.values());
    }

    /**
     * Add experience to skill
     */
    addExperience(skillId, amount) {
        const skill = this.getSkill(skillId);
        if (!skill) return false;
        return skill.addExperience(amount);
    }

    /**
     * Get total level (sum of all skills)
     */
    getTotalLevel() {
        let total = 0;
        for (const skill of this.skills.values()) {
            total += skill.level;
        }
        return total;
    }

    /**
     * Get total experience (sum of all skills)
     */
    getTotalExperience() {
        let total = 0;
        for (const skill of this.skills.values()) {
            total += skill.experience;
        }
        return total;
    }
}
