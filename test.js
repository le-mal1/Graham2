
function newTest1() {
    let deck1 = new Deck();
    deck1.addCard(3, 2, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER)]);
    deck1.addCard(3, 2, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER)]);
    let deck2 = new Deck();
    deck2.addCard(0, 6, [
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER),
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER),
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER)
    ]);
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
    deck1.addCard(3, 2, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER)]);
    deck1.addCard(0, 4, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER)]);
    let deck2 = new Deck();
    deck2.addCard(0, 6, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER)]);
    deck2.addCard(0, 8, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)]);
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
    deck1.addCard(0, 4, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER)]);
    let deck2 = new Deck();
    deck2.addCard(0, 2, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_PV_1, TARGET_MY_CARD)]);
    deck2.addCard(0, 3, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_PV_1, TARGET_MY_CARD)]);
    deck2.addCard(0, 5, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)]);
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

function newTest4() {
    let deck1 = new Deck();
    deck1.addCard(0, 4, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_CARD)]);
    let deck2 = new Deck();
    deck2.addCard(1, 1);
    let match = new Match(deck1, deck2);

    console.log("Test 4");
    match.play();

    if (
        match.batt0[0].body.force == 1 && match.batt0[0].body.pv == 3 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == 0
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }

}

function newTest5() {
    let deck1 = new Deck();
    deck1.addCard(0, 3, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_PV_1, TARGET_MY_CARDS)]);
    deck1.addCard(0, 3, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)]);
    let deck2 = new Deck();
    deck2.addCard(2, 1);
    let match = new Match(deck1, deck2);

    console.log("Test 5");
    match.play();

    if (match.nbTurn == 6) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 0 && match.batt0[1].body.pv == -1 &&
        match.batt1[0].body.force == 2 && match.batt1[0].body.pv == 1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }

}

// Additional tests for untested targets
function newTest6() {
    // TARGET_OPPONENT_LEADER
    let deck1 = new Deck();
    deck1.addCard(0, 3, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_OPPONENT_LEADER)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2);
    let match = new Match(deck1, deck2);

    console.log("Test 6 - TARGET_OPPONENT_LEADER");
    match.play();
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == -1 &&
        match.batt1[0].body.force == 2 && match.batt1[0].body.pv == 2
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest7() {
    // TARGET_MY_LEADER_NEIGHBOORS
    let deck1 = new Deck();
    deck1.addCard(1, 2);
    deck1.addCard(0, 3, [
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_LEADER_NEIGHBOORS),
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)
    ]);
    let deck2 = new Deck();
    deck2.addCard(1, 2);
    let match = new Match(deck1, deck2);

    console.log("Test 7 - TARGET_MY_LEADER_NEIGHBOORS");
    match.play();
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 3 && match.batt0[1].body.pv == 1 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == -1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest8() {
    // TARGET_OPPONENT_LEADER_NEIGHBOORS
    let deck1 = new Deck();
    deck1.addCard(1, 2);
    deck1.addCard(0, 3, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_FORCE_1, TARGET_OPPONENT_LEADER_NEIGHBOORS)]);
    let match = new Match(deck1, deck2);

    console.log("Test 8 - TARGET_OPPONENT_LEADER_NEIGHBOORS");
    match.play();
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 3 && match.batt0[1].body.pv == 1 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == -1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest9() {
    // TARGET_MY_CARD_NEIGHBOORS
    let deck1 = new Deck();
    deck1.addCard(1, 2);
    deck1.addCard(0, 3, [
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_CARD_NEIGHBOORS),
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)
    ]);
    let deck2 = new Deck();
    deck2.addCard(1, 2);
    let match = new Match(deck1, deck2);

    console.log("Test 9 - TARGET_MY_CARD_NEIGHBOORS");
    match.play();
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 3 && match.batt0[1].body.pv == 1 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == -1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest10() {
    // TARGET_MY_EDGE_RIGHT
    let deck1 = new Deck();
    deck1.addCard(1, 2);
    deck1.addCard(0, 3, [
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_EDGE_RIGHT),
        new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)
    ]);
    let deck2 = new Deck();
    deck2.addCard(1, 2);
    let match = new Match(deck1, deck2);

    console.log("Test 10 - TARGET_MY_EDGE_RIGHT");
    match.play();
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 3 && match.batt0[1].body.pv == 1 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == -1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest11() {
    // TARGET_MY_EDGE_LEFT
    console.log("Test 11 - TARGET_MY_EDGE_LEFT");
    let deck1 = new Deck();
    deck1.addCard(0, 1, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_EDGE_LEFT)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2);
    let match = new Match(deck1, deck2);

    match.play();
    if (
        match.batt0[0].body.force == 1 && match.batt0[0].body.pv == 0 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == 1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest12() {
    // TARGET_OPPONENT_EDGE_RIGHT
    console.log("Test 12 - TARGET_OPPONENT_EDGE_RIGHT");
    let deck1 = new Deck();
    deck1.addCard(1, 2);
    deck1.addCard(0, 3, [ new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_OPPONENT_EDGE_RIGHT)]);
    let match = new Match(deck1, deck2);

    match.play();
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 3 && match.batt0[1].body.pv == 1 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == -1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest13() {
    // TARGET_OPPONENT_EDGE_LEFT
    console.log("Test 13 - TARGET_OPPONENT_EDGE_LEFT");
    let deck1 = new Deck();
    deck1.addCard(0, 1, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_EDGE_LEFT)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_EDGE_LEFT)]);
    let match = new Match(deck1, deck2);

    match.play();
    if (
        match.batt0[0].body.force == 1 && match.batt0[0].body.pv == 0 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == 1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest14() {
    // TARGET_MY_EDGES
    console.log("Test 14 - TARGET_MY_EDGES");
    let deck1 = new Deck();
    deck1.addCard(1, 2, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_FORCE_1, TARGET_MY_EDGES)]);
    deck1.addCard(0, 2, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2);
    let match = new Match(deck1, deck2);

    match.play();
    if (
        match.batt0[0].body.force == 1 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 2 && match.batt0[1].body.pv == 1 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == -1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest15() {
    // TARGET_OPPONENT_EDGES
    console.log("Test 15 - TARGET_OPPONENT_EDGES");
    let deck1 = new Deck();
    deck1.addCard(1, 2);
    deck1.addCard(0, 2, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2, [new Capacity(TRIGGER_START_YOUR_TURN, EFFECT_ADD_FORCE_1, TARGET_OPPONENT_EDGES)]);
    let match = new Match(deck1, deck2);

    match.play();
    if (
        match.batt0[0].body.force == 1 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 2 && match.batt0[1].body.pv == 1 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == -1
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest16() {
    // TARGET_OPPONENT_CARDS
    console.log("Test 16 - TARGET_OPPONENT_CARDS");
    let deck1 = new Deck();
    deck1.addCard(0, 1, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_FORCE_1, TARGET_OPPONENT_CARDS)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2);
    deck2.addCard(1, 2);
    deck2.addCard(0, 3, [
        new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE),
        new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)

    ]);
    let match = new Match(deck1, deck2);

    match.play();
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == 0 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == 3 &&
        match.batt1[1].body.force == 2 && match.batt1[1].body.pv == 2 &&
        match.batt1[2].body.force == 2 && match.batt1[2].body.pv == 2
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest17() {
    // TARGET_EVERY_CARDS
    console.log("Test 17 - TARGET_EVERY_CARDS");
    let deck1 = new Deck();
    deck1.addCard(0, 1, [new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_ADD_FORCE_1, TARGET_EVERY_CARDS)]);
    let deck2 = new Deck();
    deck2.addCard(1, 2);
    deck2.addCard(1, 2);
    deck2.addCard(0, 3, [
        new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE),
        new Capacity(TRIGGER_START_OPPONENT_TURN, EFFECT_CALL_SUPPORT, TARGET_NONE)

    ]);
    let match = new Match(deck1, deck2);

    match.play();
    if (
        match.batt0[0].body.force == 1 && match.batt0[0].body.pv == 0 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == 2 &&
        match.batt1[1].body.force == 2 && match.batt1[1].body.pv == 2 &&
        match.batt1[2].body.force == 2 && match.batt1[2].body.pv == 2
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}

function newTest18() {
    console.log("Test 18 - ENTER MY CARD");
    let deck1 = new Deck();
    deck1.addCard(0, 1, [new Capacity(TRIGGER_ENTER_MY_CARD, EFFECT_ADD_FORCE_1, TARGET_MY_CARD)]);
    deck1.addCard(0, 1, [new Capacity(TRIGGER_ENTER_MY_CARD, EFFECT_CALL_SUPPORT, TARGET_NONE)]);
    let deck2 = new Deck();
    deck2.addCard(1, 1);
    let match = new Match(deck1, deck2);

    match.play();
    if (
        match.batt0[0].body.force == 0 && match.batt0[0].body.pv == 0 &&
        match.batt0[1].body.force == 1 && match.batt0[1].body.pv == 0 &&
        match.batt1[0].body.force == 1 && match.batt1[0].body.pv == 0
    ) {
        console.log("OK");
    } else {
        console.log("ERROR");
    }
}