class DeckInMatch {
    constructor(cards = []) {
        this.cards = cards;
        this.idLastCard = this.cards.length - 1;
    }

    addCard(card) {
        this.cards.push(card);
        this.updateIdLastCard();
    }

    drawCard() {
        let cardDrawed = this.cards[this.idLastCard];
        //console.log("affichage crate du deck: " + this.cards);
        this.cards.pop();
        this.updateIdLastCard();
        return cardDrawed;
    }

    updateIdLastCard() {
        this.idLastCard = this.cards.length - 1;
    }
}