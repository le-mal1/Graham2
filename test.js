
function newTest1() {
    let deck1 = new Deck();
    deck1.addCard(3, 2, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }]);
    deck1.addCard(3, 2, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }]);
    let deck2 = new Deck();
    deck2.addCard(0, 6, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }, { trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }, { trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }]);
    deck2.addCard(0, 8);
    let match = new Match(deck1, deck2);

    console.log("Test 1");
    match.play();

    if (match.batt0PosLeader == 1) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (match.batt1PosLeader == -1) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (
        match.batt0[0].body.force == 5 && match.batt0[0].body.pv == -1 &&
        match.batt1[0].body.force == 0 && match.batt1[0].body.pv == 0 &&
        match.batt1[1].body.force == 3 && match.batt1[1].body.pv == -4
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (match.nbTurn == 5) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest2() {
    let deck1 = new Deck();
    deck1.addCard(3, 2, [{ trigger: TRIGGER_START_OPPONENT_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }]);
    deck1.addCard(0, 4, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }]);
    let deck2 = new Deck();
    deck2.addCard(0, 6, [{ trigger: TRIGGER_START_OPPONENT_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }]);
    deck2.addCard(0, 8, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_CALL_SUPPORT }]);
    let match = new Match(deck1, deck2);

    console.log("Test 2");
    match.play();

    if (match.batt0PosLeader == 1) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (match.batt1PosLeader == -1) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (
        match.batt0[0].body.force == 3 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 4 && match.batt0[1].body.pv == 1 &&
        match.batt1[0].body.force == 2 && match.batt1[0].body.pv == -1 &&
        match.batt1[1].body.force == 1 && match.batt1[1].body.pv == -2
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (match.nbTurn == 8) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest3() {
    let deck1 = new Deck();
    deck1.addCard(0, 4, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_ADD_FORCE_1_LEADER }]);
    let deck2 = new Deck();
    deck2.addCard(0, 2, [{ trigger: TRIGGER_START_OPPONENT_TURN, effect: EFFECT_ADD_PV_1_CARD }]);
    deck2.addCard(0, 3, [{ trigger: TRIGGER_START_OPPONENT_TURN, effect: EFFECT_ADD_PV_1_CARD }]);
    deck2.addCard(0, 5, [{ trigger: TRIGGER_START_YOUR_TURN, effect: EFFECT_CALL_SUPPORT }]);
    let match = new Match(deck1, deck2);

    console.log("Test 3");
    match.play();

    if (match.batt0PosLeader == 0) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (match.batt1PosLeader == -1) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (
        match.batt0[0].body.force == 4 && match.batt0[0].body.pv == 4 &&
        match.batt1[0].body.force == 0 && match.batt1[0].body.pv == -1 &&
        match.batt1[1].body.force == 0 && match.batt1[1].body.pv == -1 &&
        match.batt1[2].body.force == 0 && match.batt1[2].body.pv == 0
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (match.nbTurn == 8) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}