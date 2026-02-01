
function returnToPreviousStep(match) {
    if (match.displayingMatchIndex > 0)
        match.displayingMatchIndex--;
    displayStep(match);
    updateStepButtons();
}

function goToNextStep(match) {
    if (match.displayingMatchIndex < match.displayingMatch.length - 1)
        match.displayingMatchIndex++;
    displayStep(match);
    updateStepButtons();
}

function goToFirstStep(match) {
    match.displayingMatchIndex = 0;
    displayStep(match);
    updateStepButtons();
}

function goToLastStep(match) {
    match.displayingMatchIndex = match.displayingMatch.length - 1;
    displayStep(match);
    updateStepButtons();
}

function displayStep(match) {
    document.getElementById("game").innerHTML = match.displayingMatch[match.displayingMatchIndex].game;
}

function updateStepButtons() {
    if (match.displayingMatchIndex <= 0) {
        document.getElementById("previous-step-button").style.opacity = 0.5;
        document.getElementById("first-step-button").style.opacity = 0.5;
    } else {
        document.getElementById("previous-step-button").style.opacity = 1;
        document.getElementById("first-step-button").style.opacity = 1;
    }

    if (match.displayingMatchIndex >= match.displayingMatch.length - 1) {
        document.getElementById("next-step-button").style.opacity = 0.5;
        document.getElementById("last-step-button").style.opacity = 0.5;
    } else {
        document.getElementById("next-step-button").style.opacity = 1;
        document.getElementById("last-step-button").style.opacity = 1;
    }
}