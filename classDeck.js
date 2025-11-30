class Deck {
    constructor(cards = []) {
        this.cards = cards;
        //this.idLastCard = this.cards.length - 1;
    }

    addCard(force, pv, capacities) {
        this.cards.push(new Card(force, pv, capacities));
        //this.updateIdLastCard();
    }

    /*drawCard() {
        let cardDrawed = this.cards[this.idLastCard];
        this.cards = this.cards.pop();
        this.updateIdLastCard();
        return cardDrawed;
    }*/

    /*updateIdLastCard() {
        this.idLastCard = this.cards.length - 1;
    }*/

    copy() {
        let returnCards = [];
        this.cards.forEach((card) => returnCards.push(card));
        return new DeckInMatch(returnCards);
    }

    importJson(jsonObject) {
        let tmpCard;
        jsonObject.cards.forEach((card) => {
            tmpCard = new Card();
            tmpCard.force = card.force;
            tmpCard.pv = card.pv;
            tmpCard.capacities = card.capacities;
            this.cards.push(tmpCard);
        });

        return this;
    }
}