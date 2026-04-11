const NAME_PART_1 = new Map();
NAME_PART_1.set(EFFECT_NONE, "Citoyen");
NAME_PART_1.set(EFFECT_ADD_FORCE, "Guerrier");
NAME_PART_1.set(EFFECT_ADD_PV, "Guerisseur");
NAME_PART_1.set(EFFECT_REMOVE_FORCE, "Alchimiste");
NAME_PART_1.set(EFFECT_REMOVE_PV, "Archer");
//NAME_PART_1.set(EFFECT_CALL_SUPPORT, "Invocateur");

const NAME_PART_2 = new Map();
NAME_PART_2.set(TRIGGER_NONE, " gobelin");
NAME_PART_2.set(TRIGGER_START_YOUR_TURN, " humain");
NAME_PART_2.set(TRIGGER_START_OPPONENT_TURN, " orc");
NAME_PART_2.set(TRIGGER_START_EACH_TURN, " nain");
NAME_PART_2.set(TRIGGER_ENTER_MY_CARD, " elfe");
NAME_PART_2.set(TRIGGER_WHEN_BECOMING_LEADER, " gremlin");

function getName(capa){
    let name = "";
    name += NAME_PART_1.get(capa[0].effect);
    name += NAME_PART_2.get(capa[0].trigger);
    return name;
}