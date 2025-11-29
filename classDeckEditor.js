class DeckEditor {
    constructor() {
        this.deck1 = new Deck();
        this.deck2 = new Deck();

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


    displayDeck() {
        this.deck1.cards.forEach((card) => {
            this.display(displayOutputCard(card), "cards-list");
        });
    }

    updateDisplayCardEditor(deck, cardPos) {
        let tmpCard = deck.cards[cardPos];
        let output = "";
        output += "<div>Force: <select>";
        for(let i = 0; i < 10; i++){
            if(tmpCard.force == i){
                output += "<option '" + i + "' selected='selected'>";
            } else {
                output += "<option>";
            }
            output += i + "</option>";
        }
        output += "</select></div>";
        output += "<div>Pv: <select>";
        for(let i = 0; i < 10; i++){
            if(tmpCard.pv == i){
                output += "<option '" + i + "' selected='selected'>";
            } else {
                output += "<option>";
            }
            output += i + "</option>";
        }
        output += "</select></div>";
        //output += "<div>PV: <select><option>" + tmpCard.pv + "<option></select></div>";
        this.display(output, "card-editor", true);
    }

    display(txt, id, isReplacing = false) {
        if (isReplacing)
            document.getElementById(id).innerHTML = txt + "<br/>";
        else
            document.getElementById(id).innerHTML += txt + "<br/>";
    }
}