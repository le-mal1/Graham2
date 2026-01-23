class VisualEffects {
    constructor(){
        this.isLeader = {name: IS_LEADER, isActive: false};
        this.isDead = {name: IS_DEAD, isActive: false};
    }

    getVisualEffects(){
        let output = [];

        if(this.isLeader.isActive)
            output.push(this.isLeader.name);
        if(this.isDead.isActive)
            output.push(this.isDead.name);

        return output;
    }
}