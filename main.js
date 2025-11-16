const END_GAME = "end game";
const TEST = true;

let deck1 = new Deck();
let deck2 = new Deck();

for (let i = 0; i < 5; i++) {
    deck1.addCard(createRandomCard().force, createRandomCard().pv, createRandomCard().capacities);
    deck2.addCard(createRandomCard().force, createRandomCard().pv, createRandomCard().capacities);
}

let match = new Match(deck1, deck2);
match.play();
if (TEST) {
    newTest1();
    newTest2();
    newTest3();
}

function createRandomCard() {
    let nbCapa = Math.floor(Math.random() * 2);
    let capacities = [];
    let randomNbTrigger;
    let randomNbEffect;
    for (let i = 0; i < nbCapa; i++) {
        randomNbTrigger = Math.floor(Math.random() * TRIGGERS_ARRAY.length);
        randomNbEffect = Math.floor(Math.random() * EFFECTS_ARRAY.length);
        capacities.push({ trigger: TRIGGERS_ARRAY[randomNbTrigger], effect: EFFECTS_ARRAY[randomNbEffect] });
    }
    return new Card(Math.floor(Math.random() * 10), Math.floor(Math.random() * 9) + 1, capacities);
}
