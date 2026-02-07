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
        for (let i = 0; i < 100; i++) {
            if (this.playNextTurn() == END_GAME) {
                break;
            }
        }
        this.resetDisplayingMatchIndex();
    }

    playNextTurn() {

        this.nbTurn++;
        this.newStep();
        this.displayTurn(this.nbTurn, this.currentPlayerId);

        this.newStep();
        this.displayPhaseName("LEADERS PHASE");
        // Update des Leaders

        this.updateLeader(this.currentPlayerId);
        this.updateLeader(1 - this.currentPlayerId);
        this.depilage();

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

        // Triggers START EACH TURN
        this.pushToPileCapacitiesFromBattlefield(TRIGGER_START_EACH_TURN, 1 - this.currentPlayerId);
        this.pushToPileCapacitiesFromBattlefield(TRIGGER_START_EACH_TURN, this.currentPlayerId);

        // Triggers START OPPONENT TURN
        this.pushToPileCapacitiesFromBattlefield(TRIGGER_START_OPPONENT_TURN, 1 - this.currentPlayerId);

        // Triggers START YOUR TURN
        this.pushToPileCapacitiesFromBattlefield(TRIGGER_START_YOUR_TURN, this.currentPlayerId);

        // DEPILAGE
        this.depilage();

        this.displayBattlefields();

        this.newStep();
        this.displayPhaseName("COMBAT PHASE");
        // Combats des leaders

        if (this.getLeaderCard(0) != null)
            this.getLeaderCard(0).visualEffects.isFighting0.isActive = true;
        if (this.getLeaderCard(1) != null)
            this.getLeaderCard(1).visualEffects.isFighting1.isActive = true;

        this.displayBattlefields();

        if (this.batt0PosLeader != null && this.batt1PosLeader != null) {
            this.batt0[this.batt0PosLeader].pv -= this.batt1[this.batt1PosLeader].force;
            this.batt1[this.batt1PosLeader].pv -= this.batt0[this.batt0PosLeader].force;
        }

        this.checkDeadLeaders();

        this.newStep();
        this.displayPhaseName("END PHASE");
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
                    let tmpDrawnCard = tmpDeck.drawCard();
                    tmpBatt.push(tmpDrawnCard);
                    this.getPlayerEdgeRight(playerId).visualEffects.isEnteredThisStep.isActive = true;
                    tmpBattPosLeader = tmpBatt.length - 1;
                    /*tmpDrawnCard.capacities.forEach((capa) => {
                        if (capa.trigger == TRIGGER_ENTER_MY_CARD) {
                            this.pushToPileCapacitiesFromCard(capa.trigger, playerId, tmpBattPosLeader)
                        }
                    });*/
                    this.pushToPileCapacitiesFromCard(TRIGGER_ENTER_MY_CARD, playerId, tmpBattPosLeader);
                }
            } else {
                for (let i = 0; i < tmpBatt.length; i++) {
                    if (tmpBatt[i].pv > 0) {
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
        if (pos > 0)
            output.push(pos - 1);
        if (pos < this.getPlayerBatt(playerId).length - 1)
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
                    this.pile.push({ capacity: new Capacity(trigger, card.capacities[capaId].effect, card.capacities[capaId].target, card.capacities[capaId].value), playerId: playerId, pos: pos });
                }
            }
        }
    }

    depilage() {
        let tmpPlayerId;
        let target;
        let tmpTopElement;
        let tmpTopCapacity;
        while (this.pile.length > 0) {

            tmpTopElement = this.pile.getTopElement();
            tmpTopCapacity = tmpTopElement.capacity;

            this.displayBattlefields();
            this.newStep();
            this.displayPhaseName(tmpTopElement.playerId + "/" + tmpTopElement.pos + " : " + tmpTopCapacity.toString());
            tmpPlayerId = tmpTopElement.playerId;
            this.getPlayerCard(tmpPlayerId, tmpTopElement.pos).visualEffects.isResolving.isActive = true;
            this.pile.pop();

            switch (tmpTopCapacity.effect) {
                case EFFECT_ADD_FORCE:
                    if (this.getTargets(tmpTopElement).length > 0)
                        this.getTargets(tmpTopElement).forEach((card) => card.force += tmpTopCapacity.value);
                    break;
                case EFFECT_REMOVE_FORCE:
                    if (this.getTargets(tmpTopElement).length > 0)
                        this.getTargets(tmpTopElement).forEach((card) => card.force -= tmpTopCapacity.value);
                    break;
                case EFFECT_ADD_PV:
                    if (this.getTargets(tmpTopElement).length > 0)
                        this.getTargets(tmpTopElement).forEach((card) => card.pv += tmpTopCapacity.value);
                    break;
                case EFFECT_REMOVE_PV:
                    if (this.getTargets(tmpTopElement).length > 0)
                        this.getTargets(tmpTopElement).forEach((card) => card.pv -= tmpTopCapacity.value);
                    this.checkDeadLeaders()
                    break;
                case EFFECT_CALL_SUPPORT:
                    if (this.getPlayerDeck(tmpPlayerId).cards.length > 0) {
                        this.getPlayerBatt(tmpPlayerId).push(this.getPlayerDeck(tmpPlayerId).drawCard());
                        this.getPlayerEdgeRight(tmpPlayerId).visualEffects.isEnteredThisStep.isActive = true;
                        this.pushToPileCapacitiesFromCard(TRIGGER_ENTER_MY_CARD, tmpPlayerId, this.getPlayerBatt(tmpPlayerId).length - 1);
                    }

                    break;
                case EFFECT_CHANGE_LEADER:
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
                    break;
                case EFFECT_NONE:
                    break;
                default:
                    break;
            }
        }
    }

    getTargets(_elem) {
        let output = [];
        switch (_elem.capacity.target) {
            case TARGET_MY_LEADER:
                output = [this.getLeaderCard(_elem.playerId)];
                break;
            case TARGET_OPPONENT_LEADER:
                output = [this.getLeaderCard(1 - _elem.playerId)];
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
            case TARGET_MY_LEADER_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(_elem.playerId, this.getLeaderPosBatt(_elem.playerId));
                break;
            case TARGET_OPPONENT_LEADER_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(1 - _elem.playerId, this.getLeaderPosBatt(1 - _elem.playerId));
                break;
            case TARGET_MY_CARD_NEIGHBOORS:
                output = this.getPlayerCardNeighboors(_elem.playerId, _elem.pos);
                break;
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

        output = output.filter(e => e.pv > 0);
        return output;
    }

    display(txt) {
        this.displayingMatch[this.displayingMatchIndex].game += txt;
    }

    displayTurn(nbTurn, playerId) {
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
                displayBatt += displayOutputCard(tmpCard, false, false, tmpCard.visualEffects);
            }
            displayBatt += "</div>";
        }

        this.display(displayBatt);
        this.removeTmpVisualEffects();
    }

    newStep() {
        this.displayingMatchIndex++;
        this.displayingMatch[this.displayingMatchIndex] = { game: "", capaCanvas: "" };
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

    checkDeadLeaders() {
        let check = false;

        if (this.batt0PosLeader != null && this.batt0[this.batt0PosLeader].pv <= 0) {
            this.batt0PosLeader = null;
            this.updateVisualEffects();
            check = true;
        }

        if (this.batt1PosLeader != null && this.batt1[this.batt1PosLeader].pv <= 0) {
            this.batt1PosLeader = null;
            this.updateVisualEffects();
            check = true;
        }

        if (check == false) {
            for (let playerId = 0; playerId < 2; playerId++) {
                for (let j = 0; j < this.getPlayerBatt(playerId).length; j++) {
                    if (this.getPlayerBatt(playerId)[j].pv <= 0) {
                        this.updateVisualEffects();
                        break;
                    }
                }
            }
        }

    }

    changeLeader(playerId, pos) {
        this["batt" + playerId + "PosLeader"] = pos;
    }

}