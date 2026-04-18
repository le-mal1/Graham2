//Parameters of the game
const TEST = false;

if (TEST) {
    runTests();
} else {
    let deck1;
    let deck2;
    let URLparams = new URLSearchParams(document.location.search);
    if (URLparams.get("deck1") == "RANDOM") {
        deck1 = createRandomDeck();
    } else {
        deck1 = new Deck().importJson(JSON.parse(localStorage.getItem("deck1")));
    }
    if (URLparams.get("deck2") == "RANDOM") {
        deck2 = createRandomDeck();
    } else {
        deck2 = new Deck().importJson(JSON.parse(localStorage.getItem("deck2")));
    }
    var match = new Match(deck1, deck2);
    match.play();

    displayGoToFirstStep(match);
}

function createRandomDeck(size = 7) {
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
        force = Math.floor(random() * 10);
        pv = Math.floor(random() * 9) + 1;

        capaTrigger = randomElement(TRIGGERS_ARRAY);
        capaEffect = randomElement(EFFECTS_ARRAY.toSpliced(0, 1));
        capaTarget = randomElement(TARGETS_ARRAY.toSpliced(0, 1));
        capaValue = randomElement(VALUES_ARRAY.toSpliced(0, 1));
        capacities = [];
        capacities.push(new Capacity(capaTrigger, capaEffect, capaTarget, capaValue));
        deck.addCard(force, pv, capacities);
    }
    return deck;
}