class Deck {
    constructor(cards = []) {
        this.cards = cards;
        this.idLastCard = this.cards.length - 1;
    }

    addCard(force, pv) {
        this.cards.push(new Card(force, pv));
        this.updateIdLastCard();
    }

    drawCard() {
        let cardDrawed = this.cards[this.idLastCard];
        this.cards = this.cards.pop();
        this.updateIdLastCard();
        return cardDrawed;
    }

    updateIdLastCard() {
        this.idLastCard = this.cards.length - 1;
    }

    copy() {
        let returnCards = [];
        this.cards.forEach((card) => returnCards.push({ body: card, alive: true }));
        return new DeckInMatch(returnCards);
    }
}