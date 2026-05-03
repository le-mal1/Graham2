class DeckInMatch {
    constructor(cards = []) {
        this.cards = [];
        cards.forEach((card) => {
            this.addCard(card);
        });
    }

    addCard(card) {
        this.cards.push(new CardInMatch(card.force, card.pv, card.capacities.slice()));
    }

    drawCard() {
        let cardDrawed = this.cards[0];
        this.cards.splice(0, 1);
        return cardDrawed;
    }
}