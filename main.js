const END_GAME = "end game";

let deck1 = new Deck();
let deck2 = new Deck();

for (let i = 0; i < 5; i++) {
    deck1.addCard(Math.floor(Math.random() * 10), Math.floor(Math.random() * 9) + 1, [{trigger:TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_STRENGTH_LEADER}]);
    deck2.addCard(Math.floor(Math.random() * 10), Math.floor(Math.random() * 9) + 1, []);
}
/*for (let i = 0; i < 10; i++){
    deck1.addCard(1, 2);
    deck2.addCard(2, 1);
}*/

//console.log(deck1, deck2);

//let match = new Match(deck1, deck2);

//match.play();
newTest1();
