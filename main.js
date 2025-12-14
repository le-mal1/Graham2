const END_GAME = "end game";
const TEST = false;

if (TEST) {
    newTest1();
    newTest2();
    newTest3();
    newTest4();
    newTest5();
    newTest6();
    newTest7();
    newTest8();
    newTest9();
    newTest10();
    newTest11();
    newTest12();
    newTest13();
    newTest14();
    newTest15();
    newTest16();
    newTest17();
    newTest18();
} else {

    let deck1;
    let deck2;
    let URLparams = new URLSearchParams(document.location.search);
    if(URLparams.get("deck1") == "RANDOM") {
        deck1 = createRandomDeck();
    } else {
            deck1 = new Deck().importJson(JSON.parse(localStorage.getItem("deck1")));
    }
    if(URLparams.get("deck2") == "RANDOM") {
        deck2 = createRandomDeck();
    } else {
            deck2 = new Deck().importJson(JSON.parse(localStorage.getItem("deck2")));
    }
    let match = new Match(deck1, deck2);
    match.play();
}

function createRandomDeck(size = 7){
    let deck = new Deck();
    let force;
    let pv;
    let capacities = [];
    let capaTrigger;
    let capaEffect;
    let capaTarget;
    for(let i = 0; i < size; i++){
        //deck.addCard(1, 1);
        force = Math.floor(Math.random() * 10);
        pv = Math.floor(Math.random() * 9) + 1;

        capaTrigger = randomElement(TRIGGERS_ARRAY);
        capaEffect = randomElement(EFFECTS_ARRAY);
        capaTarget = randomElement(TARGETS_ARRAY);
        capacities = [];
        capacities.push(new Capacity(capaTrigger, capaEffect, capaTarget)); 
        deck.addCard(force, pv, capacities);
    }
    return deck;
}