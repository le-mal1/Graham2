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
        this.cards.pop();
        this.updateIdLastCard();
        return cardDrawed;
    }

    updateIdLastCard() {
        this.idLastCard = this.cards.length - 1;
    }
}