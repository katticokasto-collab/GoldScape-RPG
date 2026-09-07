/**
 * Inventory system - manages items and storage
 */

class Item {
    constructor(name, id, quantity = 1, properties = {}) {
        this.name = name;
        this.id = id;
        this.quantity = quantity;
        this.stackable = properties.stackable !== false; // Most items stack
        this.weight = properties.weight || 0;
        this.value = properties.value || 0;
        this.properties = properties;
    }

    /**
     * Add quantity to item
     */
    add(amount) {
        if (this.stackable) {
            this.quantity += amount;
            return true;
        }
        return false; // Can't stack non-stackable items
    }

    /**
     * Remove quantity from item
     */
    remove(amount) {
        this.quantity -= amount;
        return this.quantity <= 0;
    }

    /**
     * Clone the item
     */
    clone() {
        return new Item(this.name, this.id, this.quantity, { ...this.properties });
    }
}

class Inventory {
    constructor(maxSlots = 28) {
        this.maxSlots = maxSlots; // OSRS bank/inventory size
        this.slots = new Array(maxSlots).fill(null);
        this.totalWeight = 0;
        this.maxWeight = 1000; // Units
    }

    /**
     * Add item to inventory
     */
    addItem(item) {
        // Try to stack with existing item
        if (item.stackable) {
            for (let i = 0; i < this.slots.length; i++) {
                if (this.slots[i] && this.slots[i].id === item.id) {
                    this.slots[i].add(item.quantity);
                    this.totalWeight += item.quantity * item.weight;
                    return true;
                }
            }
        }

        // Find empty slot
        for (let i = 0; i < this.slots.length; i++) {
            if (!this.slots[i]) {
                this.slots[i] = item.clone();
                this.totalWeight += item.quantity * item.weight;
                return true;
            }
        }

        // No space
        return false;
    }

    /**
     * Remove item from inventory
     */
    removeItem(itemId, quantity = 1) {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i] && this.slots[i].id === itemId) {
                const item = this.slots[i];
                this.totalWeight -= quantity * item.weight;
                
                if (item.remove(quantity)) {
                    this.slots[i] = null;
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Get item count by ID
     */
    getItemCount(itemId) {
        for (const slot of this.slots) {
            if (slot && slot.id === itemId) {
                return slot.quantity;
            }
        }
        return 0;
    }

    /**
     * Get all items
     */
    getAllItems() {
        return this.slots.filter(slot => slot !== null);
    }

    /**
     * Get inventory usage (0-1)
     */
    getUsage() {
        const usedSlots = this.slots.filter(slot => slot !== null).length;
        return usedSlots / this.maxSlots;
    }

    /**
     * Clear inventory
     */
    clear() {
        this.slots = new Array(this.maxSlots).fill(null);
        this.totalWeight = 0;
    }

    /**
     * Get formatted inventory for UI
     */
    getFormattedItems() {
        return this.getAllItems().map(item => ({
            name: item.name,
            quantity: item.quantity,
            id: item.id
        }));
    }
}
