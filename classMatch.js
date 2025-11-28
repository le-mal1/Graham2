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
        //this.display("<br/>TURN: " + this.nbTurn + " Current player: " + this.currentPlayerId);
        this.displayTurn(this.nbTurn, this.currentPlayerId);


        //this.display("<br/>LEADERS PHASE");
        this.displayPhaseName("LEADERS PHASE");
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

        //this.display("<br/>COMBAT PHASE");
        this.displayPhaseName("COMBAT PHASE");
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
    getPlayerCards(playerId) {
        let output = [];
        this.getPlayerBatt(playerId).forEach((card) => {
            if (card.body.pv > 0)
                output.push(card)
        });
        return output;
    }

    getAllCards() {
        let output = [];
        this.getPlayerBatt(this.currentPlayerId).forEach((card) => {
            if (card.body.pv > 0)
                output.push(card)
        });
        this.getPlayerBatt(1 - this.currentPlayerId).forEach((card) => {
            if (card.body.pv > 0)
                output.push(card)
        });
        return output;
    }

    getPlayerCardNeighboors(playerId, pos) {
        let output = [];
        if (pos > 0)
            output.push(this.getPlayerCard(playerId, pos - 1));
        if (pos < this.getPlayerBatt(playerId).length - 1)
            output.push(this.getPlayerCard(playerId, pos + 1));
        return output;
    }

    getPlayerEdgeRight(playerId) {
        for (let i = this.getPlayerBatt(playerId).length - 1; i >= 0; i++) {
            if (this.getPlayerBatt(playerId)[i].body.pv > 0) {
                return this.getPlayerBatt(playerId)[i];
            }
        }
        return [];
    }

    getPlayerEdgeLeft(playerId) {
        for (let i = 0; i < this.getPlayerBatt(playerId).length; i++) {
            if (this.getPlayerBatt(playerId)[i].body.pv > 0) {
                return this.getPlayerBatt(playerId)[i];
            }
        }
        return [];
    }

    empilageForStep(trigger, playerId, needAlive = true) {
        for (let i = 0; i < this.getPlayerBatt(playerId).length; i++) {
            if (needAlive == true && this.getPlayerBatt(playerId)[i].body.pv > 0) {
                this.getPlayerBatt(playerId)[i].body.capacities.forEach((capa) => {
                    if (capa.trigger == trigger) {
                        this.pile.push({ effect: capa.effect, target: capa.target, playerId: playerId, pos: i });
                    }
                });
                /*let capa;
                for(let j = this.getPlayerBatt(playerId)[i].body.capacities.length - 1; j >= 0; j--){
                    capa = this.getPlayerBatt(playerId)[i].body.capacities[j];
                    if (capa.trigger == trigger) {
                        this.pile.push({ effect: capa.effect, target: capa.target, playerId: playerId, pos: i });
                    }
                }*/
            }
        }
    }

    depilage() {
        let tmpPlayerId;
        let target;
        let tmpTopCapacity;
        while (this.pile.length > 0) {
            tmpTopCapacity = this.pile.getTopElement();
            this.pile.pop();
            tmpPlayerId = tmpTopCapacity.playerId;
            this.display("Effect: " + tmpTopCapacity.effect + ", Player: " + tmpPlayerId + ", Pos: " + tmpTopCapacity.pos + ", Target: " + tmpTopCapacity.target);
            switch (tmpTopCapacity.effect) {
                // new
                case EFFECT_ADD_FORCE_1:
                    this.getTargets(tmpTopCapacity).forEach((card) => card.body.force++);
                    break;
                case EFFECT_ADD_PV_1:
                    this.getTargets(tmpTopCapacity).forEach((card) => card.body.pv++);
                    break;
                case EFFECT_CALL_SUPPORT:
                    if (this.getPlayerDeck(tmpPlayerId).cards.length > 0)
                        this.getPlayerBatt(tmpPlayerId).push(this.getPlayerDeck(tmpPlayerId).drawCard());

                    break;
                default:
                    break;
            }
        }
    }

    getTargets(_target) {
        let output = [];
        switch (_target.target) {
            case TARGET_MY_LEADER:
                output = [this.getLeaderCard(_target.playerId)];
                break;
            case TARGET_OPPONENT_LEADER:
                output = [this.getLeaderCard(1 - _target.playerId)];
                break;
            case TARGET_MY_CARD:
                output = [this.getPlayerCard(_target.playerId, _target.pos)];
                break;
            case TARGET_MY_CARDS:
                output = this.getPlayerCards(_target.playerId);
                break;
            case TARGET_OPPONENT_CARDS:
                output = this.getPlayerCards(1 - _target.playerId);
                break;
            case TARGET_EVERY_CARDS:
                output = this.getAllCards();
                break;
            case TARGET_MY_LEADER_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(_target.playerId, this.getLeaderPosBatt(_target.playerId));
                break;
            case TARGET_OPPONENT_LEADER_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(1 - _target.playerId, this.getLeaderPosBatt(1 - _target.playerId));
                break;
            case TARGET_MY_CARD_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(_target.playerId, _target.pos);
                break;
            case TARGET_MY_EDGE_RIGHT:
                output = [this.getPlayerEdgeRight(_target.playerId)];
                break;
            case TARGET_MY_EDGE_LEFT:
                output = [this.getPlayerEdgeLeft(_target.playerId)];
                break;
            case TARGET_OPPONENT_EDGE_RIGHT:
                output = [this.getPlayerEdgeRight(1 - _target.playerId)];
                break;
            case TARGET_OPPONENT_EDGE_LEFT:
                output = [this.getPlayerEdgeLeft(1 - _target.playerId)];
                break;
            case TARGET_MY_EDGES:
                output.push(this.getPlayerEdgeRight(_target.playerId));
                output.push(this.getPlayerEdgeLeft(_target.playerId));
                break;
            case TARGET_OPPONENT_EDGES:
                output.push(this.getPlayerEdgeRight(1 - _target.playerId));
                output.push(this.getPlayerEdgeLeft(1 - _target.playerId));
                break;
            case TARGET_NONE:
                output = [];
                break;
            default:
                output = [];
                break;
        }

        output = output.filter(e => e.body.pv > 0);
        return output;
    }

    display(txt) {
        document.getElementById("game").innerHTML += txt + "<br/>";
    }

    displayTurn(nbTurn, playerId) {
        //this.display("<br/>TURN: " + this.nbTurn + " Current player: " + this.currentPlayerId);
        this.display("<h2>TURN: " + this.nbTurn + " Current player: " + this.currentPlayerId + "</h2>");

    }

    displayPhaseName(phaseName) {
        this.display("<h3>" + phaseName + "</h3>");

    }

    displayBattlefields() {
        /*let displayBatt = "";

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


        this.display(displayBatt);*/

        let displayBatt = "";
        let tmpBatt;
        let tmpBattPosLeader;
        let tmpCard;
        let cardClass;

        for (let f = 0; f < 2; f++) {

            tmpBatt = this["batt" + f];
            tmpBattPosLeader = this["batt" + f + "PosLeader"];

            displayBatt += "<div class='battlefield'>";
            for (let i = 0; i < tmpBatt.length; i++) {
                cardClass = "card";
                if(tmpBatt[i].body.pv <= 0)
                    cardClass += " dead";
                tmpCard = this.getPlayerCard(f, i);
                displayBatt += "<div class='" + cardClass + "'>";
                displayBatt += "<div class='card-force'>Force: " + tmpCard.body.force + "</div>";
                displayBatt += "<div class='card-pv'>PV: " + tmpCard.body.pv + "</div>";
                tmpCard.body.capacities.forEach((capa) => {
                    displayBatt += "<div class='card-capacity'>Capacity:<br/>-" + 
                    capa.trigger + "<br/>-" + 
                    capa.effect + "<br/>-" + 
                    capa.target + "</div>"
                });
                displayBatt += "</div>";
            }
            displayBatt += "</div>";
        }

        this.display(displayBatt);
    }

}