class DeckDrafter {
    constructor() {
        this.randomDeck = new Deck();
        this.deck = new Deck();

        this.init();
    }

    init() {
        this.randomDeck = this.createRandomDeck(10);
    }

    /*updateCard() {
        if (this.deck.cards.length > 0) {
            let selectedCard = this.deck.cards[this.selectedCardPos];
            selectedCard.force = document.getElementById("card-force-selector").selectedIndex;
            selectedCard.pv = document.getElementById("card-pv-selector").selectedIndex;
            for (let capaId = 0; capaId < selectedCard.capacities.length; capaId++) {
                selectedCard.capacities[capaId].trigger = TRIGGERS_ARRAY[document.getElementById("card-trigger-selector-" + capaId).selectedIndex];
                selectedCard.capacities[capaId].effect = EFFECTS_ARRAY[document.getElementById("card-effect-selector-" + capaId).selectedIndex];
                selectedCard.capacities[capaId].value = VALUES_ARRAY[document.getElementById("card-value-selector-" + capaId).selectedIndex];
                selectedCard.capacities[capaId].target = TARGETS_ARRAY[document.getElementById("card-target-selector-" + capaId).selectedIndex];
            }
            this.displayRandomDeck();
            this.displayDeck();


        }
    }*/

    deleteCard() {
        if (this.deck.cards.length > 0) {
            this.deck.cards.pop();
            this.displayRandomDeck();
            this.displayDeck();
        }
    }

    addCard() {
        let tmpCard = new Card();
        this.deck.cards.push(tmpCard);

        this.displayRandomDeck();
        this.displayDeck();
    }

    /*copyCard() {
        if (this.deck.cards.length > 0) {
            let cardToCopy = this.deck.cards[this.selectedCardPos];
            this.deck.cards.splice(this.selectedCardPos + 1, 0, cardToCopy.copy());

            this.updateSelectedCardPos(this.selectedCardPos + 1);
        } else {
            alert("you need another card");
        }
    }*/

    displayRandomDeck() {
        this.eraseDisplayRandomDeck();
        this.randomDeck.cards.forEach((card, cardPos) => {
            //let onClick = " onclick=\"deckEditor.moveCard(" + parseInt(cardPos + 1000) + ")";
            let onClick = " onclick=\"deckEditor.moveCard(" + parseInt(cardPos + 1000) + "); deckEditor.updateSelectedCardPos(" + parseInt(cardPos + 1000) + ")\"";
            //console.log(displayOutputCard(card, false, onClick));
            this.display(displayOutputCard(card, onClick), "random-cards-list");
        });

        this.updateDisplayDeckActions();
    }

    displayDeck() {
        this.eraseDisplayDeck();
        this.deck.cards.forEach((card, cardPos) => {
            //let isSelectedCard = (cardPos == this.selectedCardPos) ? true : false;
            let onClick = " onclick=\"deckEditor.moveCard(" + cardPos + "); deckEditor.updateSelectedCardPos(" + cardPos + ")\"";
            this.display(displayOutputCard(card, onClick), "cards-list");
        });

        this.updateDisplayDeckActions();
    }

    moveCard(pos) {
        let pos2 = pos - 1000;
        if (pos2 >= 0) {
            this.deck.addCard(this.randomDeck.cards[pos2].force, this.randomDeck.cards[pos2].pv, this.randomDeck.cards[pos2].capacities);
            this.randomDeck.cards.splice(pos2, 1);
        }
        this.displayRandomDeck();
        this.displayDeck();
    }

    updateSelectedCardPos(pos) {
        if (pos < 1000) {
            this.randomDeck.addCard(this.deck.cards[pos].force, this.deck.cards[pos].pv, this.deck.cards[pos].capacities);
            this.deck.cards.splice(pos, 1);
        }
        this.displayRandomDeck();
        this.displayDeck();
    }

    updateDisplayDeckActions() {
        let output = "TOTAL POWER: " + this.deck.getTotalPower() + " / GREATEST POWER: " + this.deck.getGreatestPower();

        this.display(output, "cards-total-power", true);

    }

    eraseDisplayRandomDeck() {
        this.display("", "random-cards-list", true);
    }

    eraseDisplayDeck() {
        this.display("", "cards-list", true);
    }

    saveAsDeck(deckId) {
        localStorage.setItem("deck" + deckId, JSON.stringify(this.deck));
    }

    display(txt, id, isReplacing = false) {
        if (isReplacing) {
            document.getElementById(id).innerHTML = txt;
        }
        else {
            document.getElementById(id).innerHTML += txt;
        }
    }

    createRandomDeck(size = 7) {
        let deck = new Deck();
        let force;
        let pv;
        let capacities = [];
        let capaTrigger;
        let capaEffect;
        let capaTarget;
        let capaValue;
        for (let i = 0; i < size; i++) {
            //deck.addCard(1, 1);
            //force = Math.floor(Math.random() * 10);
            //pv = Math.floor(Math.random() * 9) + 1;
            force = Math.floor(random() * 10);
            pv = Math.floor(random() * 9) + 1;

            capaTrigger = randomElement(TRIGGERS_ARRAY);
            capaEffect = randomElement(EFFECTS_ARRAY.toSpliced(0, 1));
            capaTarget = randomElement(TARGETS_ARRAY.toSpliced(0, 1));
            capaValue = randomElement(VALUES_ARRAY.toSpliced(0, 1));

            /*if (capaEffect == EFFECT_CALL_SUPPORT) {
                capaTarget = TARGET_NONE;
                capaValue = VALUE_0;
            }*/

            if (capaEffect == EFFECT_ADD_FORCE || capaEffect == EFFECT_ADD_PV) {
                capaTarget = randomElement(FRIENDLY_TARGETS);
            }

            if (capaEffect == EFFECT_REMOVE_FORCE || capaEffect == EFFECT_REMOVE_PV) {
                capaTarget = randomElement(OPPONENT_TARGETS);
            }

            capacities = [];
            capacities.push(new Capacity(capaTrigger, capaEffect, capaTarget, capaValue));
            deck.addCard(force, pv, capacities);
        }
        return deck;
    }
}