
function returnToLastStep(match) {
    if (match.displayingMatchIndex > 0)
        match.displayingMatchIndex--;
    displayStep(match);
}

function goToNextStep(match) {
    if (match.displayingMatchIndex < match.displayingMatch.length - 1)
        match.displayingMatchIndex++;
    displayStep(match);
}

function displayStep(match) {
    document.getElementById("game").innerHTML = match.displayingMatch[match.displayingMatchIndex];
}