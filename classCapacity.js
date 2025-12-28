class Capacity {
    constructor(trigger, effect, target = TARGET_NONE, value = 0){
        this.trigger = trigger;
        this.effect = effect;
        this.target = target;
        this.value = value;
    }

    copy() {
        return new Capacity(this.trigger, this.effect, this.target, this.value);
    }
}