class DeckEditor {
    constructor() {
        this.deck = new Deck();
        this.selectedCardPos = -1;

        this.init();
    }

    init() {
        this.addCard();
    }

    updateCard() {
        if (this.deck.cards.length > 0) {
            let selectedCard = this.deck.cards[this.selectedCardPos];
            selectedCard.force = document.getElementById("card-force-selector").selectedIndex;
            selectedCard.pv = document.getElementById("card-pv-selector").selectedIndex;
            for (let capaId = 0; capaId < selectedCard.capacities.length; capaId++) {
                selectedCard.capacities[capaId].trigger = TRIGGERS_ARRAY[document.getElementById("card-trigger-selector-" + capaId).selectedIndex];
                //if (TRIGGERS_ARRAY[document.getElementById("card-trigger-selector-" + capaId).selectedIndex] != TRIGGER_NONE) {
                //this.updateDisplayCardEditor(this.deck, this.selectedCardPos);
                selectedCard.capacities[capaId].effect = EFFECTS_ARRAY[document.getElementById("card-effect-selector-" + capaId).selectedIndex];
                //if (EFFECTS_ARRAY[document.getElementById("card-effect-selector-" + capaId).selectedIndex] != EFFECT_NONE) {
                //this.updateDisplayCardEditor(this.deck, this.selectedCardPos);
                selectedCard.capacities[capaId].target = TARGETS_ARRAY[document.getElementById("card-target-selector-" + capaId).selectedIndex];
                //}
                //}
            }
            this.displayDeck();


        }
    }

    deleteCard() {
        if (this.deck.cards.length > 0) {
            this.deck.cards.splice(this.selectedCardPos, 1);
            if (this.selectedCardPos >= this.deck.cards.length)
                this.selectedCardPos = this.deck.cards.length - 1;
            this.displayDeck();
        }
    }

    addCard() {
        let tmpCard = new Card();
        this.deck.cards.splice(this.selectedCardPos + 1, 0, tmpCard);

        this.selectedCardPos++;
        this.displayDeck();
    }

    copyCard() {
        if (this.deck.cards.length > 0) {
            let cardToCopy = this.deck.cards[this.selectedCardPos];
            this.deck.cards.splice(this.selectedCardPos + 1, 0, cardToCopy.copy());

            this.updateSelectedCardPos(this.selectedCardPos + 1);
        } else {
            alert("you need another card");
        }
    }

    displayDeck() {
        this.eraseDisplayDeck();
        this.deck.cards.forEach((card, cardPos) => {
            let isSelectedCard = (cardPos == this.selectedCardPos) ? true : false;
            this.display(displayOutputCard(card, isSelectedCard, cardPos), "cards-list");
        });

        this.updateDisplayDeckActions();
        this.updateDisplayCardEditor(this.deck, this.selectedCardPos);
        this.updateDisplayCardSelector();
    }

    updateSelectedCardPos(newSelectedCardPos) {
        this.selectedCardPos = newSelectedCardPos;
        this.displayDeck();
    }

    updateDisplayCardSelector() {
        let output = "";
        let selected;
        for (let cardPos = 0; cardPos < this.deck.cards.length; cardPos++) {
            if (this.selectedCardPos == cardPos) {
                selected = "selected='selected'";
            } else {
                selected = "";
            }
            output += "<option value='" + cardPos + "' " + selected + ">" + cardPos + "</option>";
        }
        this.display(output, "cards-selector", true);
    }

    updateDisplayCardEditor(deck, cardPos) {
        let output = "";
        let tmpCard = deck.cards[cardPos];
        let onChangeJS = "onchange=\"deckEditor.updateCard()\"";
        if (deck.cards.length > 0) {
            output += "<div>Force: <select id='card-force-selector' " + onChangeJS + ">";
            for (let i = 0; i < 10; i++) {
                if (tmpCard.force == i) {
                    output += "<option value='" + i + "' selected='selected'>";
                } else {
                    output += "<option>";
                }
                output += i;
                output += "</option>";
            }
            output += "</select> (" + tmpCard.getPowerForce() + ")</div>";
            output += "<div>Pv: <select id='card-pv-selector' " + onChangeJS + ">";
            for (let i = 0; i < 10; i++) {
                if (tmpCard.pv == i) {
                    output += "<option value='" + i + "' selected='selected'>";
                } else {
                    output += "<option>";
                }
                output += i;
                output += "</option>";
            }
            output += "</select> (" + tmpCard.getPowerPv() + ")</div>";
            tmpCard.capacities.forEach((capa, index) => {
                output += "<br/><div>Capacity:</div>";

                output += "<div>Trigger: <select id='card-trigger-selector-" + index + "' " + onChangeJS + ">";
                for (let i = 0; i < TRIGGERS_ARRAY.length; i++) {
                    if (capa.trigger == TRIGGERS_ARRAY[i]) {
                        output += "<option value='" + TRIGGERS_ARRAY[i] + "' selected='selected'>";
                    } else {
                        output += "<option>";
                    }
                    output += TRIGGERS_ARRAY[i];
                    output += "</option>";
                }
                output += "</select> (" + Card.getPowerTrigger(capa.trigger) + ")</div>";

                //if (capa.trigger != TRIGGER_NONE) {
                output += "<div>Effect: <select id='card-effect-selector-" + index + "' " + onChangeJS + ">";
                for (let i = 0; i < EFFECTS_ARRAY.length; i++) {
                    if (capa.effect == EFFECTS_ARRAY[i]) {
                        output += "<option value='" + EFFECTS_ARRAY[i] + "' selected='selected'>";
                    } else {
                        output += "<option>";
                    }
                    output += EFFECTS_ARRAY[i];
                    output += "</option>";
                }
                output += "</select> (" + Card.getPowerEffect(capa.effect) + ")</div>";

                //if (capa.effect != EFFECT_NONE && capa.effect != EFFECT_CALL_SUPPORT) {
                output += "<div>Target: <select id='card-target-selector-" + index + "' " + onChangeJS + ">";
                for (let i = 0; i < TARGETS_ARRAY.length; i++) {
                    if (capa.target == TARGETS_ARRAY[i]) {
                        output += "<option value='" + TARGETS_ARRAY[i] + "' selected='selected'>";
                    } else {
                        output += "<option>";
                    }
                    output += TARGETS_ARRAY[i];
                    output += "</option>";
                }
                output += "</select> (" + Card.getPowerTarget(capa.target) + ")</div>";
                //}
                //}
            });

            output += "<br/><div>TOTAL POWER: " + tmpCard.getTotalPower() + "</div>";
        }
        this.display(output, "card-editor", true);
    }

    updateDisplayDeckActions() {
        let output = "DECK TOTAL POWER: " + this.deck.getTotalPower() + " / GREATER POWER IN DECK: " + this.deck.getGreatestPower();

        this.display(output, "cards-total-power", true);

    }

    eraseDisplayDeck() {
        this.display("", "cards-list", true);
    }

    saveAsDeck(deckId) {
        localStorage.setItem("deck" + deckId, JSON.stringify(this.deck));
    }

    loadDeck(deckId) {
        this.deck = new Deck().importJson(JSON.parse(localStorage.getItem("deck" + deckId)));
        this.displayDeck();
    }

    display(txt, id, isReplacing = false) {
        if (isReplacing)
            document.getElementById(id).innerHTML = txt;
        else
            document.getElementById(id).innerHTML += txt;
    }
}