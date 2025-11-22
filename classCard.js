class Card {
    constructor(force, pv, capacities = []) {
        this.force = force;
        this.pv = pv;

        if (capacities.length > 0 && capacities[0] instanceof Capacity == false) {
            throw new Error("Need a Capacity class");

        } else {
            this.capacities = capacities;
        }

    }
}