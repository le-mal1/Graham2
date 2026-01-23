class Card {
    constructor(force = 1, pv = 1, capacities = []) {
        this.force = force;
        this.pv = pv;
        if (capacities.length == 0) {
            capacities = this.capacities = [
                new Capacity(TRIGGER_NONE, EFFECT_NONE, TARGET_NONE),
                new Capacity(TRIGGER_NONE, EFFECT_NONE, TARGET_NONE),
                new Capacity(TRIGGER_NONE, EFFECT_NONE, TARGET_NONE)
            ];
        }

        if (capacities.length > 0 && capacities[0] instanceof Capacity == false) {
            throw new Error("Need a Capacity class");
        } else {
            this.capacities = capacities.slice();
        }
        this.visualEffects = new VisualEffects();

    }

    copy() {
        let tmpCard = new Card();
        tmpCard.force = this.force;
        tmpCard.pv = this.pv;
        tmpCard.capacities = [];
        this.capacities.forEach((capa) => 
            tmpCard.capacities.push(capa.copy())
        );
        return tmpCard;
    }

    initFromStruc(cardStruc) {
        this.force = cardStruc.force;
        this.pv = cardStruc.pv;
        this.capacities = [];
        cardStruc.capacities.forEach((capaStruc) => {
            this.capacities.push(new Capacity(capaStruc.trigger, capaStruc.effect, capaStruc.target, capaStruc.value));
        });
    }

    static getPowerForce(force) {
        let power = 0;
        power = force;
        return power;
    }

    getPowerForce() {
        return Card.getPowerForce(this.force);
    }

    static getPowerPv(pv) {
        let power = 0;
        power = pv;
        return power;
    }

    getPowerPv() {
        return Card.getPowerPv(this.pv);
    }

    static getPowerTrigger(trigger) {
        let power = 0;
        power = TRIGGERS_POWER_MAP.get(trigger);
        return power;
    }

    static getPowerEffect(effect) {
        let power = 0;
        power = EFFECTS_POWER_MAP.get(effect);
        return power;
    }

    static getPowerTarget(target) {
        let power = 0;
        power = TARGETS_POWER_MAP.get(target);
        return power;
    }

    getTotalPower() {
        let power = 0;
        power += this.getPowerForce();
        power += this.getPowerPv();
        this.capacities.forEach((capa) => {
            power += Card.getPowerTrigger(capa.trigger);
            power += Card.getPowerEffect(capa.effect);
            power += Card.getPowerTarget(capa.target);
        });
        return power;
    }
}