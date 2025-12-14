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
            let tmpCard = this.deck.cards[this.selectedCardPos];
            tmpCard.force = document.getElementById("card-force-selector").selectedIndex;
            tmpCard.pv = document.getElementById("card-pv-selector").selectedIndex;
            for (let capaId = 0; capaId < tmpCard.capacities.length; capaId++) {
                tmpCard.capacities[capaId].trigger = TRIGGERS_ARRAY[document.getElementById("card-trigger-selector-" + capaId).selectedIndex];
                tmpCard.capacities[capaId].effect = EFFECTS_ARRAY[document.getElementById("card-effect-selector-" + capaId).selectedIndex];
                tmpCard.capacities[capaId].target = TARGETS_ARRAY[document.getElementById("card-target-selector-" + capaId).selectedIndex];
            }

            /*this.deck1.cards.forEach((card, cardPos) => {
                document.getElementById("card-selector").innerHTML = "<option value='" + cardPos + "'>" + cardPos + "</option>";
            })*/
            this.displayDeck();

            localStorage.setItem("deck1", JSON.stringify(this.deck));
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
        let tmpCard = new Card(1, 1, [
            new Capacity(TRIGGER_NONE, EFFECT_NONE, TARGET_NONE),
            new Capacity(TRIGGER_NONE, EFFECT_NONE, TARGET_NONE),
            new Capacity(TRIGGER_NONE, EFFECT_NONE, TARGET_NONE),
        ]);
        this.deck.cards.splice(this.selectedCardPos + 1, 0, tmpCard);

        this.selectedCardPos++;
        this.displayDeck();
    }

    copyCard() {
        if (this.deck.cards.length > 0) {
            let cardToCopy = this.deck.cards[this.selectedCardPos];
            let tmpCard = new Card(cardToCopy.force, cardToCopy.pv, cardToCopy.capacities.slice());
            this.deck.cards.splice(this.selectedCardPos + 1, 0, tmpCard);

            this.selectedCardPos++;
            this.displayDeck();
        } else {
            alert("you need another card");
        }
    }


    displayDeck() {
        this.eraseDisplayDeck();
        this.deck.cards.forEach((card, cardPos) => {
            let isSelectedCard = (cardPos == this.selectedCardPos) ? true : false;
            this.display(displayOutputCard(card, isSelectedCard), "cards-list");
        });

        this.updateDisplayCardEditor(this.deck, this.selectedCardPos)
        this.updateCardSelector();
    }

    updateCardSelector() {
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
        let tmpCard = deck.cards[cardPos];
        let output = "";
        if (deck.cards.length > 0) {
            output += "<div>Force: <select id='card-force-selector'>";
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
            output += "<div>Pv: <select id='card-pv-selector'>";
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
                output += "<div>Capacity:</div>";

                output += "<div>Trigger: <select id='card-trigger-selector-" + index + "'>";
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

                output += "<div>Effect: <select id='card-effect-selector-" + index + "'>";
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

                output += "<div>Target: <select id='card-target-selector-" + index + "'>";
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
            });

            output += "<div>TOTAL POWER: " + tmpCard.getTotalPower() + "</div>";
        }
        this.display(output, "card-editor", true);

        output = "TOTAL POWER: " + deck.getTotalPower();
        this.display(output, "cards-total-power", true); // TO REFACTOR
    }

    eraseDisplayDeck() {
        this.display("", "cards-list", true);
    }

    display(txt, id, isReplacing = false) {
        if (isReplacing)
            document.getElementById(id).innerHTML = txt + "<br/>";
        else
            document.getElementById(id).innerHTML += txt + "<br/>";
    }
}