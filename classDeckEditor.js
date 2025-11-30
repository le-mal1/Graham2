class DeckEditor {
    constructor() {
        this.deck1 = new Deck();
        this.selectedCardPos = 0;

        this.init();
    }

    init() {
        this.deck1.addCard(0, 1, [
            new Capacity(TRIGGER_ENTER_MY_CARD, EFFECT_CALL_SUPPORT, TARGET_NONE)
        ]);
        this.deck1.addCard(1, 1, [
            new Capacity(TRIGGER_ENTER_MY_CARD, EFFECT_CALL_SUPPORT, TARGET_NONE)
        ]);
        this.deck1.addCard(1, 2, [
            new Capacity(TRIGGER_ENTER_MY_CARD, EFFECT_CALL_SUPPORT, TARGET_NONE)
        ]);
        this.deck1.addCard(2, 2, [
            new Capacity(TRIGGER_ENTER_MY_CARD, EFFECT_CALL_SUPPORT, TARGET_NONE)
        ]);
        this.deck1.addCard(2, 3, [
            new Capacity(TRIGGER_ENTER_MY_CARD, EFFECT_CALL_SUPPORT, TARGET_NONE)
        ]);
        this.deck1.addCard(3, 3, [
            new Capacity(TRIGGER_ENTER_MY_CARD, EFFECT_CALL_SUPPORT, TARGET_NONE)
        ]);
        this.deck1.addCard(3, 4, [
            new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_CARDS),
            new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_PV_1, TARGET_MY_CARDS),
            new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_PV_1, TARGET_MY_CARDS),
        ]);
    }

    updateCard() {
        let tmpCard = this.deck1.cards[this.selectedCardPos];
        tmpCard.force = document.getElementById("card-force-selector").selectedIndex;
        tmpCard.pv = document.getElementById("card-pv-selector").selectedIndex;
        for (let capaId = 0; capaId < tmpCard.capacities.length; capaId++) {
            tmpCard.capacities[capaId].trigger = TRIGGERS_ARRAY[document.getElementById("card-trigger-selector-" + capaId).selectedIndex];
            tmpCard.capacities[capaId].effect = EFFECTS_ARRAY[document.getElementById("card-effect-selector-" + capaId).selectedIndex];
            tmpCard.capacities[capaId].target = TARGETS_ARRAY[document.getElementById("card-target-selector-" + capaId).selectedIndex];
        }
        this.displayDeck();
    }

    deleteCard(){
        this.deck1.cards.splice(this.selectedCardPos, 1);
        this.displayDeck();
    }


    displayDeck() {
        this.eraseDisplayDeck();
        this.deck1.cards.forEach((card) => {
            this.display(displayOutputCard(card), "cards-list");
        });
    }

    updateDisplayCardEditor(deck, cardPos) {
        let tmpCard = deck.cards[cardPos];
        let output = "";
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
        output += "</select></div>";
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
        output += "</select></div>";
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
            output += "</select></div>";

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
            output += "</select></div>";

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
            output += "</select></div>";
        });
        this.display(output, "card-editor", true);
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