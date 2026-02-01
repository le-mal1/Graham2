class VisualEffects {
    constructor(){
        this.isLeader = {name: IS_LEADER, isActive: false};
        this.isDead = {name: IS_DEAD, isActive: false};
        this.isEnteredThisStep = {name: IS_ENTERED_THIS_STEP, isActive: false};
        this.isResolving = {name: IS_RESOLVING, isActive: false};
        this.isFighting0 = {name: IS_FIGHTING0, isActive: false};
        this.isFighting1 = {name: IS_FIGHTING1, isActive: false};
    }

    getVisualEffects(){
        let output = [];

        if(this.isLeader.isActive)
            output.push(this.isLeader.name);
        if(this.isDead.isActive)
            output.push(this.isDead.name);
        if(this.isEnteredThisStep.isActive)
            output.push(this.isEnteredThisStep.name);
        if(this.isResolving.isActive)
            output.push(this.isResolving.name);
        if(this.isFighting0.isActive)
            output.push(this.isFighting0.name);
        if(this.isFighting1.isActive)
            output.push(this.isFighting1.name);

        return output;
    }
}