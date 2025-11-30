class DeckInMatch {
    constructor(cards = []) {
        this.cards = cards;
    }

    addCard(card) {
        this.cards.push(card);
    }

    drawCard() {
        let cardDrawed = this.cards[0];
        this.cards.splice(0, 1);
        return cardDrawed;
    }
}