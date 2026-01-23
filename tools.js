function randomElement(array) {
    if (array.length > 0) {
        return array[Math.floor(Math.random() * array.length)];
    } else {
        return null;
    }
}


//DISPLAY
function displayOutputCard(card, isSelected = false, cardPosInDeck = undefined, visualEffects = new VisualEffects()) {
    let output = "";
    let cardClass = "card";
    if (isSelected)
        cardClass += " selected-card";
    visualEffects.getVisualEffects().forEach((visualEffect) => {
        switch (visualEffect) {
            case IS_LEADER:
                cardClass += " leader-card";
                break;

            case IS_DEAD:
                cardClass += " dead-card";
                break;

            default:
                break;
        }
    });

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
        if (capa.trigger != TRIGGER_NONE || capa.effect != EFFECT_NONE) {
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