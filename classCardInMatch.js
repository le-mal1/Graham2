class CardInMatch extends Card {
    constructor(force = 1, pv = 1, capacities = []) {
        super(force, pv, capacities);
        this.isJustDead = false;
    }

    changePv(value) {
        if (this.pv > 0) {
            this.pv += value;
            if (this.pv <= 0)
                this.isJustDead = true;
        }
    }
}