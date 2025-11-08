class Match {


    constructor(deck1, deck2) {
        this.deck1 = deck1.copy();
        this.deck2 = deck2.copy();
        this.batt1 = [];
        this.batt2 = [];
        this.batt1PosLeader = null;
        this.batt2PosLeader = null;
        this.currentPlayerId = 0;
        this.nbTurn = 0;
    }

    playNextTurn() {

        this.nbTurn++;
        console.log("TURN: " + this.nbTurn, "Current player: " + parseInt(this.currentPlayerId + 1));

        console.log("LEADERS PHASE");
        // Update des Leaders

        this.updateLeader(this.currentPlayerId);
        this.updateLeader(1 - this.currentPlayerId);

        if (this.batt1PosLeader == -1) {
            if (this.batt2PosLeader == -1) {
                console.log("DRAW !!!");
                return END_GAME;
            } else {
                console.log("PLAYER 2 WIN !!!");
                return END_GAME;
            }
        } else if (this.batt2PosLeader == -1) {
            console.log("PLAYER 1 WIN !!!");
            return END_GAME;
        }

        console.log(this.batt1PosLeader + 1, this.batt2PosLeader + 1);
        this.displayBattlefields();

        console.log("COMBAT PHASE");
        // Combats des leaders
        this.batt1[this.batt1PosLeader].body.pv -= this.batt2[this.batt2PosLeader].body.force;
        this.batt2[this.batt2PosLeader].body.pv -= this.batt1[this.batt1PosLeader].body.force;

        if (this.batt1[this.batt1PosLeader].body.pv <= 0) {
            this.batt1[this.batt1PosLeader].alive = false;
            this.batt1PosLeader = null;
        }

        if (this.batt2[this.batt2PosLeader].body.pv <= 0) {
            this.batt2[this.batt2PosLeader].alive = false;
            this.batt2PosLeader = null;
        }

        this.displayBattlefields();

        console.log("CHANGEMENT DE JOUEUR");
        // Changement de joueur
        if (this.currentPlayerId == 0)
            this.currentPlayerId = 1;
        else
            this.currentPlayerId = 0;

        // Affichage du nouveau joueur courant
        console.log(parseInt(this.currentPlayerId + 1));

    }

    updateLeader(playerId) {

        let tmpDeck = this["deck" + parseInt(playerId + 1)];
        let tmpBatt = this["batt" + parseInt(playerId + 1)];
        let tmpBattPosLeader = this["batt" + parseInt(playerId + 1) + "PosLeader"];

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

        this["batt" + parseInt(playerId + 1) + "PosLeader"] = tmpBattPosLeader;
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

            let tmpBatt = this["batt" + parseInt(f + 1)];
            let tmpBattPosLeader = this["batt" + parseInt(f + 1) + "PosLeader"];

            for (let i = 0; i < tmpBatt.length; i++) {
                if (tmpBattPosLeader == i)
                    displayBatt += "|[";
                else
                    displayBatt += "{";
                displayBatt += tmpBatt[i].body.force + ", ";
                displayBatt += tmpBatt[i].body.pv;
                if (tmpBattPosLeader == i)
                    displayBatt += "]|";
                else
                    displayBatt += "} ";
            }

            displayBatt += "\n";
        }


        console.log(displayBatt);
    }

}