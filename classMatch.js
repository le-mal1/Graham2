class Match {


    constructor(deck0, deck1) {
        this.deck0 = deck0.copy();
        this.deck1 = deck1.copy();
        this.batt0 = [];
        this.batt1 = [];
        this.batt0PosLeader = null;
        this.batt1PosLeader = null;
        this.currentPlayerId = 0;
        this.nbTurn = 0;
        this.pile = new Pile();
    }

    play() {
        for (let i = 0; i < 100; i++) {
            if (this.playNextTurn() == END_GAME) {
                break;
            }
        }
    }

    playNextTurn() {

        this.nbTurn++;
        console.log("TURN: " + this.nbTurn, "Current player: " + this.currentPlayerId);

        console.log("LEADERS PHASE");
        // Update des Leaders

        this.updateLeader(this.currentPlayerId);
        this.updateLeader(1 - this.currentPlayerId);

        if (this.batt0PosLeader == -1) {
            if (this.batt1PosLeader == -1) {
                console.log("DRAW !!!");
                return END_GAME;
            } else {
                console.log("PLAYER 2 WIN !!!");
                return END_GAME;
            }
        } else if (this.batt1PosLeader == -1) {
            console.log("PLAYER 1 WIN !!!");
            return END_GAME;
        }

        console.log("Pos leader 1: " + this.batt0PosLeader, "Pos leader 2: " + this.batt1PosLeader);
        this.displayBattlefields();

        // Triggers START TURN
        for (let i = 0; i < this["batt" + this.currentPlayerId].length; i++) {
            this["batt" + this.currentPlayerId][i].body.capacities.forEach((capa) => {
                if (capa.trigger == TRIGGER_START_YOUR_TURN) {
                    this.pile.push({ effect: capa.effect, player: this.currentPlayerId, id: i });
                }
            });
        }

        // DEPILAGE
        while (this.pile.length > 0) {
            //console.log("Triggers de debut de tour: " + this.pile.getTopElement().effect);
            switch (this.pile.getTopElement().effect) {
                case EFFECT_ADD_FORCE_LEADER:
                    console.log("Effect: " + this.pile.getTopElement().effect);
                    let tmpPlayerId = this.pile.getTopElement().player;
                    this.getLeaderCard(tmpPlayerId).body.force++;

                    break;
                default:
                    break;
            }
            this.pile.pop();
        }

        /*for(let i = 0; i < this.pile.length; i++){
            console.log("Triggers de debut de tour: " + this.pile.getLastElement().effect);
            this.pile.pop();
        }*/

        console.log("COMBAT PHASE");
        // Combats des leaders
        this.batt0[this.batt0PosLeader].body.pv -= this.batt1[this.batt1PosLeader].body.force;
        this.batt1[this.batt1PosLeader].body.pv -= this.batt0[this.batt0PosLeader].body.force;

        if (this.batt0[this.batt0PosLeader].body.pv <= 0) {
            this.batt0[this.batt0PosLeader].alive = false;
            this.batt0PosLeader = null;
        }

        if (this.batt1[this.batt1PosLeader].body.pv <= 0) {
            this.batt1[this.batt1PosLeader].alive = false;
            this.batt1PosLeader = null;
        }

        this.displayBattlefields();

        console.log("CHANGEMENT DE JOUEUR");
        // Changement de joueur
        if (this.currentPlayerId == 0)
            this.currentPlayerId = 1;
        else
            this.currentPlayerId = 0;

        // Affichage du nouveau joueur courant
        console.log(this.currentPlayerId);

    }

    updateLeader(playerId) {

        let tmpDeck = this["deck" + playerId];
        let tmpBatt = this["batt" + playerId];
        let tmpBattPosLeader = this["batt" + playerId + "PosLeader"];

        if (tmpBattPosLeader == null) {
            if (tmpBatt.length <= 0 || this.haveCardAlive(tmpBatt) == false) {
                if (tmpDeck.cards.length <= 0) {
                    tmpBattPosLeader = -1; // DEFEAT
                } else {
                    tmpBatt.push(tmpDeck.drawCard());
                    tmpBattPosLeader = tmpBatt.length - 1;
                }
            } else {
                tmpBattPosLeader = 0;
            }
        }

        this["batt" + playerId + "PosLeader"] = tmpBattPosLeader;
    }

    haveCardAlive(batt) {
        let cardAlive = false;
        for (let i = 0; i < batt.length; i++) {
            if (batt[i].alive == true)
                cardAlive = true;
            break;
        }
        if (cardAlive)
            return true;
        else
            return false;
    }

    displayBattlefields() {
        let displayBatt = "";

        for (let f = 0; f < 2; f++) {

            let tmpBatt = this["batt" + f];
            let tmpBattPosLeader = this["batt" + f + "PosLeader"];

            for (let i = 0; i < tmpBatt.length; i++) {
                if (tmpBattPosLeader == i)
                    displayBatt += "|[";
                else
                    displayBatt += "{";
                displayBatt += tmpBatt[i].body.force + ", ";
                displayBatt += tmpBatt[i].body.pv + ", ";
                for (let j = 0; j < tmpBatt[i].body.capacities.length; j++) {
                    displayBatt += "[";
                    displayBatt += tmpBatt[i].body.capacities[j].trigger + ", ";
                    displayBatt += tmpBatt[i].body.capacities[j].effect;
                    displayBatt += "]";
                }
                if (tmpBattPosLeader == i)
                    displayBatt += "]|";
                else
                    displayBatt += "} ";
            }

            displayBatt += "\n";
        }


        console.log(displayBatt);
    }

    getCurrentPlayerBatt() {
        return this.getPlayerBatt(this.currentPlayerId);
    }

    getPlayerBatt(playerId) {
        return this["batt" + playerId];
    }

    getLeaderPosBatt(playerId) {
        return this["batt" + playerId + "PosLeader"];
    }

    getLeaderCard(playerId){
        return this.getPlayerBatt(playerId)[this.getLeaderPosBatt(playerId)];
    }

}