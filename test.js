
function newTest1() {
    let deck1 = new Deck();
    deck1.addCard(3, 2, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_LEADER }]);
    deck1.addCard(3, 2, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_LEADER }]);
    let deck2 = new Deck();
    deck2.addCard(0, 6, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_LEADER }, { trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_LEADER }, { trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_LEADER }]);
    deck2.addCard(0, 8);
    let match = new Match(deck1, deck2);

    console.log("Test");
    match.play();

    if (match.batt1PosLeader == 1) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (match.batt2PosLeader == -1) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (
        match.batt1[0].body.force == 5 && match.batt1[0].body.pv == -1 &&
        match.batt2[0].body.force == 0 && match.batt2[0].body.pv == 0 &&
        match.batt2[1].body.force == 3 && match.batt2[1].body.pv == -4
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}