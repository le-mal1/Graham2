function randomElement(array) {
    if (array.length > 0) {
        return array[Math.floor(Math.random() * array.length)];
    } else {
        return null;
    }
}


//DISPLAY
function displayOutputCard(card) {
    let output = "";
    let cardClass = "card";
    if (card.pv <= 0)
        cardClass += " dead";
    output += "<div class='" + cardClass + "'>";
    output += "<div class='card-force'>Force: " + card.force + "</div>";
    output += "<div class='card-pv'>PV: " + card.pv + "</div>";
    card.capacities.forEach((capa) => {
        output += "<div class='card-capacity'>Capacity:<br/>-" +
            capa.trigger + "<br/>-" +
            capa.effect + "<br/>-" +
            capa.target + "</div>"
    });
    return output;
}