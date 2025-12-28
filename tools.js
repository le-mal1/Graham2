function randomElement(array) {
    if (array.length > 0) {
        return array[Math.floor(Math.random() * array.length)];
    } else {
        return null;
    }
}


//DISPLAY
function displayOutputCard(card, isSelected = false, isLeader = false, cardPosInDeck = undefined) {
    let output = "";
    let cardClass = "card";
    if (card.pv <= 0)
        cardClass += " dead-card";
    if (isSelected)
        cardClass += " selected-card";
    if (isLeader)
        cardClass += " leader-card";

    //let dataCardPosInDeck = "";
    let onClick = "";
    if (cardPosInDeck != undefined) {
        //dataCardPosInDeck = "data-cardPosInDeck=\"" + cardPosInDeck + "\"";
        onClick += " onclick=\"deckEditor.updateSelectedCardPos(" + cardPosInDeck + ")\"";
    }

    output += "<div class='" + cardClass + "' " + onClick + ">";
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
    output += "</div>";
    return output;
}