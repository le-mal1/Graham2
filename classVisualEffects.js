class VisualEffects {
    constructor(){
        this.isLeader = {name: IS_LEADER, isActive: false};
        this.isDead = {name: IS_DEAD, isActive: false};
        this.isEnteredThisStep = {name: IS_ENTERED_THIS_STEP, isActive: false};
    }

    getVisualEffects(){
        let output = [];

        if(this.isLeader.isActive)
            output.push(this.isLeader.name);
        if(this.isDead.isActive)
            output.push(this.isDead.name);
        if(this.isEnteredThisStep.isActive)
            output.push(this.isEnteredThisStep.name);

        return output;
    }
}