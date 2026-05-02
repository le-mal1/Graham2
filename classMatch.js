const END_MATCH = "end match";

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
        this.displayingMatch = [];
        this.displayingMatchIndex = -1;
    }

    play() {
        this.setupBattlefields();
        for (let i = 0; i < 100; i++) {
            if (this.playNextTurn() == END_MATCH) {
                break;
            }
        }
        this.resetDisplayingMatchIndex();
    }

    setupBattlefields() {
        let tmpDrawnCard;
        let tmpDeckLength;

        for (let tmpPlayerId = 0; tmpPlayerId < 2; tmpPlayerId++) {
            tmpDeckLength = this.getPlayerDeck(tmpPlayerId).cards.length;
            for (let tmpCard = 0; tmpCard < tmpDeckLength; tmpCard++) {
                tmpDrawnCard = this.getPlayerDeck(tmpPlayerId).drawCard();
                this.getPlayerBatt(tmpPlayerId).push(tmpDrawnCard);
                this.getPlayerEdgeRight(tmpPlayerId).visualEffects.isEnteredThisStep.isActive = true;
                this.pushToPileCapacitiesFromCard(TRIGGER_ENTER_MY_CARD, tmpPlayerId, this.getPlayerBatt(tmpPlayerId).length - 1);
            }
        }
    }

    playNextTurn() {

        if (this.nbTurn == 0) {
            this.newStep();
            this.displayPhaseName("ENTER PHASE");
            this.displayBattlefields();

            this.depilage();
        }

        this.nbTurn++;
        this.newStep();
        this.displayTurnTitle(this.nbTurn, this.currentPlayerId);

        this.newStep();
        this.displayPhaseName("LEADERS PHASE");

        // Update des Leaders
        this.updateLeader(this.getCurrentPlayerId());
        this.updateLeader(this.getOtherPlayerId());
        this.displayBattlefields();

        this.depilage();

        if (!this.haveCardAlive(this.batt0)) {
            if (!this.haveCardAlive(this.batt1)) {
                this.display("DRAW !!! --------------------------------------------------------");
                return END_MATCH;
            } else {
                this.display("PLAYER 1 WIN !!! --------------------------------------------------------");
                return END_MATCH;
            }
        } else if (!this.haveCardAlive(this.batt1)) {
            this.display("PLAYER 0 WIN !!! --------------------------------------------------------");
            return END_MATCH;
        }

        // Triggers START EACH TURN
        this.pushToPileCapacitiesFromBattlefield(TRIGGER_START_EACH_TURN, this.getOtherPlayerId());
        this.pushToPileCapacitiesFromBattlefield(TRIGGER_START_EACH_TURN, this.getCurrentPlayerId());

        // Triggers START OPPONENT TURN
        this.pushToPileCapacitiesFromBattlefield(TRIGGER_START_OPPONENT_TURN, this.getOtherPlayerId());

        // Triggers START YOUR TURN
        this.pushToPileCapacitiesFromBattlefield(TRIGGER_START_YOUR_TURN, this.getCurrentPlayerId());

        this.depilage();

        this.newStep();
        this.displayPhaseName("COMBAT PHASE");

        // Combats des leaders

        if (this.getLeaderCard(0) != null)
            this.getLeaderCard(0).visualEffects.isFighting0.isActive = true;
        if (this.getLeaderCard(1) != null)
            this.getLeaderCard(1).visualEffects.isFighting1.isActive = true;

        this.displayBattlefields();

        if (this.batt0PosLeader != null && this.batt1PosLeader != null) {
            if (this.getLeaderCard(1).force > 0)
                this.removePvToCard(this.getLeaderCard(0), this.getLeaderCard(1).force);
            //this.batt0[this.batt0PosLeader].pv -= this.batt1[this.batt1PosLeader].force;
            if (this.getLeaderCard(0).force > 0)
                this.removePvToCard(this.getLeaderCard(1), this.getLeaderCard(0).force);
            //this.batt1[this.batt1PosLeader].pv -= this.batt0[this.batt0PosLeader].force;
        }

        this.newStep();
        this.displayPhaseName("SEQUEL PHASE");

        this.updateDeadLeaders();
        this.updateVisualEffects();

        this.displayBattlefields();


        /*this.newStep();
        this.displayPhaseName("END PHASE");
        this.displayBattlefields();*/


        // Changement de joueur
        this.currentPlayerId = 1 - this.currentPlayerId;

    }

    updateLeader(playerId) {

        let tmpBatt = this.getPlayerBatt(playerId);
        let tmpBattPosLeader = this.getLeaderPosBatt(playerId);

        if (tmpBattPosLeader == null) {
            if (tmpBatt.length <= 0 || this.haveCardAlive(tmpBatt) == false) {
                tmpBattPosLeader = -1; // DEFEAT

            } else {
                for (let i = 0; i < tmpBatt.length; i++) {
                    if (tmpBatt[i].pv > 0) {
                        tmpBattPosLeader = i;
                        break;
                    }
                }
            }
        }

        this.changeLeader(playerId, tmpBattPosLeader);
    }

    haveCardAlive(batt) {
        let cardAlive = false;
        for (let i = 0; i < batt.length; i++) {
            if (batt[i].pv > 0) {
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
            if (card.pv > 0)
                output.push(card)
        });
        return output;
    }

    getAllCards() {
        let output = [];
        this.getPlayerBatt(this.currentPlayerId).forEach((card) => {
            if (card.pv > 0)
                output.push(card)
        });
        this.getPlayerBatt(1 - this.currentPlayerId).forEach((card) => {
            if (card.pv > 0)
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

    getPlayerCardNeighboorsPos(playerId, pos) {
        let output = [];
        if (pos > 0 && this.getPlayerCard(playerId, pos - 1).pv > 0)
            output.push(pos - 1);
        if (pos < this.getPlayerBatt(playerId).length - 1 && this.getPlayerCard(playerId, pos + 1).pv > 0)
            output.push(pos + 1);
        return output;
    }

    getPlayerEdgeRight(playerId) {
        for (let i = this.getPlayerBatt(playerId).length - 1; i >= 0; i--) {
            if (this.getPlayerBatt(playerId)[i].pv > 0) {
                return this.getPlayerBatt(playerId)[i];
            }
        }
        return [];
    }

    getPlayerEdgeRightPos(playerId) {
        for (let i = this.getPlayerBatt(playerId).length - 1; i >= 0; i--) {
            if (this.getPlayerBatt(playerId)[i].pv > 0) {
                return i;
            }
        }
        return null;
    }

    getPlayerEdgeLeft(playerId) {
        for (let i = 0; i < this.getPlayerBatt(playerId).length; i++) {
            if (this.getPlayerBatt(playerId)[i].pv > 0) {
                return this.getPlayerBatt(playerId)[i];
            }
        }
        return [];
    }

    getPlayerEdgeLeftPos(playerId) {
        for (let i = 0; i < this.getPlayerBatt(playerId).length; i++) {
            if (this.getPlayerBatt(playerId)[i].pv > 0) {
                return i;
            }
        }
        return null;
    }

    getCurrentPlayerId() {
        return this.currentPlayerId;
    }

    getOtherPlayerId() {
        return 1 - this.currentPlayerId;
    }

    getBattLastCard(playerId) {
        return this.getPlayerBatt(playerId)[this.getBattLastCardPos(playerId)];
    }

    getBattLastCardPos(playerId) {
        return this.getPlayerBatt(playerId).length - 1;
    }

    pushToPileCapacitiesFromBattlefield(trigger, playerId) {
        for (let i = 0; i < this.getPlayerBatt(playerId).length; i++) {
            this.pushToPileCapacitiesFromCard(trigger, playerId, i);
        }
    }

    pushToPileCapacitiesFromCard(trigger, playerId, pos) {
        let card = this.getPlayerCard(playerId, pos);
        if (card.pv > 0) {
            for (let capaId = card.capacities.length - 1; capaId >= 0; capaId--) {
                if (card.capacities[capaId].trigger == trigger) {
                    this.pile.push(
                        {
                            capacity: new Capacity(
                                card.capacities[capaId].trigger,
                                card.capacities[capaId].effect,
                                card.capacities[capaId].target,
                                card.capacities[capaId].value
                            ),
                            playerId: playerId,
                            pos: pos
                        }
                    );
                }
            }
        }
    }

    depilage() {
        let tmpPlayerId;
        let tmpTopElement;
        let tmpTopCapacity;
        while (this.pile.length > 0) {

            tmpTopElement = this.pile.getTopElement();
            tmpTopCapacity = tmpTopElement.capacity;

            //this.displayBattlefields();
            this.newStep();
            this.displayPhaseName(tmpTopElement.playerId + "/" + tmpTopElement.pos + " : " + tmpTopCapacity.toString());
            tmpPlayerId = tmpTopElement.playerId;
            this.getPlayerCard(tmpPlayerId, tmpTopElement.pos).visualEffects.isResolving.isActive = true;
            this.pile.pop();

            switch (tmpTopCapacity.effect) {
                case EFFECT_ADD_FORCE:
                    if (this.getTargets(tmpTopElement).length > 0)
                        this.getTargets(tmpTopElement).forEach((card) => this.addForceToCard(card, tmpTopCapacity.value));
                        //this.getTargets(tmpTopElement).forEach((card) => card.force += tmpTopCapacity.value);
                    break;
                case EFFECT_REMOVE_FORCE:
                    if (this.getTargets(tmpTopElement).length > 0)
                        this.getTargets(tmpTopElement).forEach((card) => this.removeForceToCard(card, tmpTopCapacity.value));
                        //this.getTargets(tmpTopElement).forEach((card) => card.force -= tmpTopCapacity.value);
                    break;
                case EFFECT_ADD_PV:
                    if (this.getTargets(tmpTopElement).length > 0)
                        this.getTargets(tmpTopElement).forEach((card) => this.addPvToCard(card, tmpTopCapacity.value));
                        //this.getTargets(tmpTopElement).forEach((card) => card.pv += tmpTopCapacity.value);
                    break;
                case EFFECT_REMOVE_PV:
                    if (this.getTargets(tmpTopElement).length > 0)
                        this.getTargets(tmpTopElement).forEach((card) => this.removePvToCard(card, tmpTopCapacity.value));
                        //this.getTargets(tmpTopElement).forEach((card) => card.pv -= tmpTopCapacity.value);
                    this.updateDeadLeaders()
                    break;
                /*case EFFECT_CHANGE_LEADER:
                    switch (tmpTopCapacity.target) {
                        case TARGET_MY_LEADER:
                            if (this.getLeaderPosBatt(tmpPlayerId) != null)
                                this.changeLeader(tmpPlayerId, this.getLeaderPosBatt(tmpPlayerId));
                            break;
                        case TARGET_OPPONENT_LEADER:
                            if (this.getLeaderPosBatt(1 - tmpPlayerId) != null)
                                this.changeLeader(1 - tmpPlayerId, this.getLeaderPosBatt(1 - tmpPlayerId));
                            break;
                        case TARGET_MY_CARD:
                            if (tmpTopElement.pv > 0)
                                this.changeLeader(tmpPlayerId, tmpTopElement.pos);
                            break;
                        case TARGET_MY_CARDS:
                            if (this.getPlayerEdgeLeftPos(tmpPlayerId) != null)
                                this.changeLeader(tmpPlayerId, this.getPlayerEdgeLeftPos(tmpPlayerId));
                            break;
                        case TARGET_OPPONENT_CARDS:
                            if (this.getPlayerEdgeLeftPos(1 - tmpPlayerId) != null)
                                this.changeLeader(1 - tmpPlayerId, this.getPlayerEdgeLeftPos(1 - tmpPlayerId));
                            break;
                        case TARGET_EVERY_CARDS:
                            if (this.getPlayerEdgeLeftPos(tmpPlayerId) != null)
                                this.changeLeader(tmpPlayerId, this.getPlayerEdgeLeftPos(tmpPlayerId));
                            if (this.getPlayerEdgeLeftPos(1 - tmpPlayerId) != null)
                                this.changeLeader(1 - tmpPlayerId, this.getPlayerEdgeLeftPos(1 - tmpPlayerId));
                            break;
                        case TARGET_MY_LEADER_NEIGHBOORS:
                            if (this.getPlayerCardNeighboorsPos(tmpPlayerId, this.getLeaderPosBatt(tmpPlayerId)).length > 0)
                                this.changeLeader(tmpPlayerId, this.getPlayerCardNeighboorsPos(tmpPlayerId, this.getLeaderPosBatt(tmpPlayerId))[0]);
                            break;
                        case TARGET_OPPONENT_LEADER_NEIGHBOORS:
                            if (this.getPlayerCardNeighboorsPos(1 - tmpPlayerId, this.getLeaderPosBatt(1 - tmpPlayerId)).length > 0)
                                this.changeLeader(1 - tmpPlayerId, this.getPlayerCardNeighboorsPos(1 - tmpPlayerId, this.getLeaderPosBatt(1 - tmpPlayerId))[0]);
                            break;
                        case TARGET_MY_CARD_NEIGHBOORS:
                            if (this.getPlayerCardNeighboorsPos(tmpPlayerId, tmpTopElement.pos).length > 0)
                                this.changeLeader(tmpPlayerId, this.getPlayerCardNeighboorsPos(tmpPlayerId, this.getLeaderPosBatt(tmpPlayerId))[0]);
                            break;
                        case TARGET_MY_EDGE_RIGHT:
                            if (this.getPlayerEdgeRightPos(tmpPlayerId) != null)
                                this.changeLeader(tmpPlayerId, this.getPlayerEdgeRightPos(tmpPlayerId));
                            break;
                        case TARGET_MY_EDGE_LEFT:
                            if (this.getPlayerEdgeLeftPos(tmpPlayerId) != null)
                                this.changeLeader(tmpPlayerId, this.getPlayerEdgeLeftPos(tmpPlayerId));
                            break;
                        case TARGET_OPPONENT_EDGE_RIGHT:
                            if (this.getPlayerEdgeRightPos(1 - tmpPlayerId) != null)
                                this.changeLeader(1 - tmpPlayerId, this.getPlayerEdgeRightPos(1 - tmpPlayerId));
                            break;
                        case TARGET_OPPONENT_EDGE_LEFT:
                            if (this.getPlayerEdgeLeftPos(1 - tmpPlayerId) != null)
                                this.changeLeader(1 - tmpPlayerId, this.getPlayerEdgeLeftPos(1 - tmpPlayerId));
                            break;
                        case TARGET_MY_EDGES:
                            if (this.getPlayerEdgeLeftPos(tmpPlayerId) != null)
                                this.changeLeader(tmpPlayerId, this.getPlayerEdgeLeftPos(tmpPlayerId));
                            break;
                        case TARGET_OPPONENT_EDGES:
                            if (this.getPlayerEdgeLeftPos(1 - tmpPlayerId) != null)
                                this.changeLeader(1 - tmpPlayerId, this.getPlayerEdgeLeftPos(1 - tmpPlayerId));
                            break;
                        case TARGET_NONE:
                            output = [];
                            break;
                        default:
                            output = [];
                            break;
                    }
                    break;*/
                case EFFECT_NONE:
                    break;
                default:
                    break;
            }
            this.displayBattlefields();
        }
    }

    getTargets(_elem) {
        let output = [];
        switch (_elem.capacity.target) {
            case TARGET_MY_LEADER:
                if (this.getLeaderPosBatt(_elem.playerId) != null)
                    output = [this.getLeaderCard(_elem.playerId)];
                else
                    output = [];
                break;
            case TARGET_OPPONENT_LEADER:
                if (this.getLeaderPosBatt(1 - _elem.playerId) != null)
                    output = [this.getLeaderCard(1 - _elem.playerId)];
                else
                    output = [];
                break;
            case TARGET_MY_CARD:
                output = [this.getPlayerCard(_elem.playerId, _elem.pos)];
                break;
            case TARGET_MY_CARDS:
                output = this.getPlayerCards(_elem.playerId);
                break;
            case TARGET_OPPONENT_CARDS:
                output = this.getPlayerCards(1 - _elem.playerId);
                break;
            case TARGET_EVERY_CARDS:
                output = this.getAllCards();
                break;
            /*case TARGET_MY_LEADER_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(_elem.playerId, this.getLeaderPosBatt(_elem.playerId));
                break;
            case TARGET_OPPONENT_LEADER_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(1 - _elem.playerId, this.getLeaderPosBatt(1 - _elem.playerId));
                break;
            case TARGET_MY_CARD_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(_elem.playerId, _elem.pos);
                break;*/
            case TARGET_MY_EDGE_RIGHT:
                output = [this.getPlayerEdgeRight(_elem.playerId)];
                break;
            case TARGET_MY_EDGE_LEFT:
                output = [this.getPlayerEdgeLeft(_elem.playerId)];
                break;
            case TARGET_OPPONENT_EDGE_RIGHT:
                output = [this.getPlayerEdgeRight(1 - _elem.playerId)];
                break;
            case TARGET_OPPONENT_EDGE_LEFT:
                output = [this.getPlayerEdgeLeft(1 - _elem.playerId)];
                break;
            case TARGET_MY_EDGES:
                output.push(this.getPlayerEdgeRight(_elem.playerId));
                output.push(this.getPlayerEdgeLeft(_elem.playerId));
                break;
            case TARGET_OPPONENT_EDGES:
                output.push(this.getPlayerEdgeRight(1 - _elem.playerId));
                output.push(this.getPlayerEdgeLeft(1 - _elem.playerId));
                break;
            case TARGET_NONE:
                output = [];
                break;
            default:
                output = [];
                break;
        }

        //console.log(_elem.capacity.target, output);
        //console.log(this.batt0, this.batt1, _elem.playerId);
        output = output.filter(e => e.pv > 0);
        return output;
    }

    display(txt) {
        this.displayingMatch[this.displayingMatchIndex].game += txt;
    }

    displayTurnTitle(nbTurn, playerId) {
        this.display("<div class='indications'><h2>TURN: " + this.nbTurn + " / Current player: " + this.currentPlayerId + "</h2></div>");

    }

    displayPhaseName(phaseName) {
        this.display("<h3>Turn " + this.nbTurn + ", Current player " + this.currentPlayerId + ", " + phaseName + "</h3>");

    }

    displayBattlefields() {

        let displayBatt = "";
        let tmpBatt;
        let tmpBattPosLeader;
        let tmpCard;

        for (let playerId = 0; playerId < 2; playerId++) {

            tmpBatt = this["batt" + playerId];
            tmpBattPosLeader = this["batt" + playerId + "PosLeader"];

            displayBatt += "<div class='battlefield'>";
            for (let cardPos = 0; cardPos < tmpBatt.length; cardPos++) {
                tmpCard = this.getPlayerCard(playerId, cardPos);
                this.updateVisualEffects();
                displayBatt += displayOutputCard(tmpCard, "", tmpCard.visualEffects);
            }
            displayBatt += "</div>";
        }

        this.display(displayBatt);
        this.removeTmpVisualEffects();
    }

    newStep() {
        this.displayingMatchIndex++;
        this.displayingMatch[this.displayingMatchIndex] = { game: "" };
        this.updateVisualEffects();
    }

    updateVisualEffects() {
        for (let playerId = 0; playerId < 2; playerId++) {
            this.getPlayerBatt(playerId).forEach((card, cardPos) => {
                if (card.pv <= 0) {
                    card.visualEffects.isDead.isActive = true;
                }
                if (!card.visualEffects.isLeader.isActive && this.getLeaderPosBatt(playerId) == cardPos) {
                    card.visualEffects.isLeader.isActive = true;
                }
                if (card.visualEffects.isLeader.isActive && this.getLeaderPosBatt(playerId) != cardPos) {
                    card.visualEffects.isLeader.isActive = false;
                }
            });
        }
    }

    removeTmpVisualEffects() {
        let playerId;
        for (let i = 0; i < 2; i++) {
            playerId = i;
            this.getPlayerBatt(playerId).forEach((card) => {
                if (card.visualEffects.isEnteredThisStep.isActive)
                    card.visualEffects.isEnteredThisStep.isActive = false;
                if (card.visualEffects.isResolving.isActive)
                    card.visualEffects.isResolving.isActive = false;
                if (card.visualEffects.isFighting0.isActive)
                    card.visualEffects.isFighting0.isActive = false;
                if (card.visualEffects.isFighting1.isActive)
                    card.visualEffects.isFighting1.isActive = false;
            });
        }
    }

    resetDisplayingMatchIndex() {
        this.displayingMatchIndex = 0;
    }

    updateDeadLeaders() {

        if (this.batt0PosLeader != null && this.batt0[this.batt0PosLeader].pv <= 0) {
            this.batt0PosLeader = null;
        }

        if (this.batt1PosLeader != null && this.batt1[this.batt1PosLeader].pv <= 0) {
            this.batt1PosLeader = null;
        }

    }

    changeLeader(playerId, pos) {
        if (this["batt" + playerId + "PosLeader"] != pos) {
            this["batt" + playerId + "PosLeader"] = pos;
            if (pos >= 0)
                this.pushToPileCapacitiesFromCard(TRIGGER_WHEN_BECOMING_LEADER, playerId, pos);
        }
    }

    addPvToCard(card, value) {
        card.pv += value;
    }

    removePvToCard(card, value) {
        card.pv -= value;
    }

    addForceToCard(card, value) {
        card.force += value;
    }

    removeForceToCard(card, value) {
        card.force -= value;
    }

}