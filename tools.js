function randomElement(array) {
    if (array.length > 0) {
        return array[Math.floor(Math.random() * array.length)];
    } else {
        return null;
    }
}


//DISPLAY
function displayOutputCard(card, isSelected = false, isLeader = false) {
    let output = "";
    let cardClass = "card";
    if (card.pv <= 0)
        cardClass += " dead-card";
    if (isSelected)
        cardClass += " selected-card";
    if (isLeader)
        cardClass += " leader-card";

    output += "<div class='" + cardClass + "'>";
    output += "<div class='card-force'>Force: " + card.force + "</div>";
    output += "<div class='card-pv'>PV: " + card.pv + "</div>";
    card.capacities.forEach((capa) => {
        if (capa.trigger != TRIGGER_NONE && capa.effect != EFFECT_NONE) {
            output += "<div class='card-capacity'>Capacity:<br/>-";
            output += capa.trigger + "<br/>-";
            output += capa.effect + "<br/>-";
            output += capa.target;
            output += "</div>";
        }
    });
    return output;
}