const END_GAME = "end game";

var deck1 = new Deck();
var deck2 = new Deck();

//console.log("Creation des decks");
for (let i = 0; i < 5; i++) {
    deck1.addCard(Math.floor(Math.random() * 10), Math.floor(Math.random() * 9) + 1, [{trigger:TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_STRENGTH_LEADER}]);
    deck2.addCard(Math.floor(Math.random() * 10), Math.floor(Math.random() * 9) + 1, []);
}
/*for (let i = 0; i < 10; i++){
    deck1.addCard(1, 2);
    deck2.addCard(2, 1);
}*/

//console.log(deck1, deck2);

var match = new Match(deck1, deck2);

for (let i = 0; i < 100; i++) {
    if (match.playNextTurn() == END_GAME) {
        break;
    }
}
