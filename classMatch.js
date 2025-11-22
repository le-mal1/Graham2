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
        this.display("<br/>TURN: " + this.nbTurn + " Current player: " + this.currentPlayerId);


        this.display("<br/>LEADERS PHASE");
        // Update des Leaders

        this.updateLeader(this.currentPlayerId);
        this.updateLeader(1 - this.currentPlayerId);

        if (this.batt0PosLeader == -1) {
            if (this.batt1PosLeader == -1) {
                this.display("DRAW !!! --------------------------------------------------------");
                return END_GAME;
            } else {
                this.display("PLAYER 1 WIN !!! --------------------------------------------------------");
                return END_GAME;
            }
        } else if (this.batt1PosLeader == -1) {
            this.display("PLAYER 0 WIN !!! --------------------------------------------------------");
            return END_GAME;
        }

        this.display("Pos leader 0: " + this.batt0PosLeader + " Pos leader 1: " + this.batt1PosLeader);
        this.displayBattlefields();

        // Triggers START OPPONENT TURN
       this.empilageForStep(TRIGGER_START_OPPONENT_TURN, 1 - this.currentPlayerId, true);

        // Triggers START TURN
       this.empilageForStep(TRIGGER_START_YOUR_TURN, this.currentPlayerId, true);

        // DEPILAGE
        this.depilage();

        this.display("<br/>COMBAT PHASE");
        // Combats des leaders
        this.batt0[this.batt0PosLeader].body.pv -= this.batt1[this.batt1PosLeader].body.force;
        this.batt1[this.batt1PosLeader].body.pv -= this.batt0[this.batt0PosLeader].body.force;

        if (this.batt0[this.batt0PosLeader].body.pv <= 0) {
            this.batt0PosLeader = null;
        }

        if (this.batt1[this.batt1PosLeader].body.pv <= 0) {
            this.batt1PosLeader = null;
        }

        this.displayBattlefields();

        // Changement de joueur
        if (this.currentPlayerId == 0)
            this.currentPlayerId = 1;
        else
            this.currentPlayerId = 0;

    }

    updateLeader(playerId) {

        let tmpDeck = this.getPlayerDeck(playerId);
        let tmpBatt = this.getPlayerBatt(playerId);
        let tmpBattPosLeader = this.getLeaderPosBatt(playerId);

        if (tmpBattPosLeader == null) {
            if (tmpBatt.length <= 0 || this.haveCardAlive(tmpBatt) == false) {
                if (tmpDeck.cards.length <= 0) {
                    tmpBattPosLeader = -1; // DEFEAT
                } else {
                    tmpBatt.push(tmpDeck.drawCard());
                    tmpBattPosLeader = tmpBatt.length - 1;
                }
            } else {
                for (let i = 0; i < tmpBatt.length; i++) {
                    if (tmpBatt[i].body.pv > 0) {
                        tmpBattPosLeader = i;
                        break;
                    }
                }
            }
        }

        this["batt" + playerId + "PosLeader"] = tmpBattPosLeader;
    }

    haveCardAlive(batt) {
        let cardAlive = false;
        for (let i = 0; i < batt.length; i++) {
            if (batt[i].body.pv > 0) {
                cardAlive = true;
                break;
            }
        }
        return cardAlive;
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

            displayBatt += "<br/>";
        }


        this.display(displayBatt);
    }

    getCurrentPlayerBatt() {
        return this.getPlayerBatt(this.currentPlayerId);
    }

    getOtherPlayerBatt() {
        return this.getPlayerBatt(1 - this.currentPlayerId);
    }

    getPlayerBatt(playerId) {
        return this["batt" + playerId];
    }

    getLeaderPosBatt(playerId) {
        return this["batt" + playerId + "PosLeader"];
    }

    getLeaderCard(playerId) {
        return this.getPlayerBatt(playerId)[this.getLeaderPosBatt(playerId)];
    }

    getPlayerCard(playerId, pos) {
        return this.getPlayerBatt(playerId)[pos];
    }

    getPlayerDeck(playerId) {
        return this["deck" + playerId];
    }

    empilageForStep(trigger, playerId, needAlive = true) {
        for (let i = 0; i < this.getPlayerBatt(playerId).length; i++) {
            if (needAlive == true && this.getPlayerBatt(playerId)[i].body.pv > 0) {
                this.getPlayerBatt(playerId)[i].body.capacities.forEach((capa) => {
                    if (capa.trigger == trigger) {
                        this.pile.push({ effect: capa.effect, target: capa.target, playerId: playerId, pos: i });
                    }
                });
            }
        }
    }

    depilage() {
        let tmpPlayerId;
        let target;
        while (this.pile.length > 0) {
            tmpPlayerId = this.pile.getTopElement().playerId;
            this.display("Effect: " + this.pile.getTopElement().effect + ", Player: " + this.pile.getTopElement().playerId + ", Pos: " + this.pile.getTopElement().pos + ", Target: " + this.pile.getTopElement().target);
            switch (this.pile.getTopElement().effect) {
                // new
                case EFFECT_ADD_FORCE_1:
                    this.getTargets(this.pile.getTopElement()).forEach((card) => card.body.force++);
                    break;
                case EFFECT_ADD_PV_1:
                    this.getTargets(this.pile.getTopElement()).forEach((card) => card.body.pv++);
                    break;
                case EFFECT_CALL_SUPPORT:
                    if (this.getPlayerDeck(tmpPlayerId).cards.length > 0)
                        this.getPlayerBatt(tmpPlayerId).push(this.getPlayerDeck(tmpPlayerId).drawCard());

                    break;
                default:
                    break;
            }
            this.pile.pop();
        }
    }

    getTargets(_target) {
        let output = [];
        switch (_target.target) {
            case TARGET_MY_LEADER:
                return [this.getLeaderCard(_target.playerId)];
                break;
            case TARGET_MY_CARD:
                return [this.getPlayerCard(_target.playerId, _target.pos)];
                break;
            case TARGET_MY_CARDS:
                this.getPlayerBatt(_target.playerId).forEach((card) => {
                    if (card.body.pv > 0)
                        output.push(card)
                });
                return output;
                break;
            case TARGET_NONE:
                return [];
                break;
            default:
                return [];
                break;
        }
        return [];
    }

    display(txt) {
        document.getElementById("game").innerHTML += txt + "<br/>";
    }

}