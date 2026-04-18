function displayGoToPreviousStep(_match) {
    if (_match.displayingMatchIndex > 0)
        _match.displayingMatchIndex--;
    displayStep(_match);
    displayStepButtons(_match);
}

function displayGoToNextStep(_match) {
    if (_match.displayingMatchIndex < _match.displayingMatch.length - 1)
        _match.displayingMatchIndex++;
    displayStep(_match);
    displayStepButtons(_match);
}

function displayGoToFirstStep(_match) {
    _match.displayingMatchIndex = 0;
    displayStep(_match);
    displayStepButtons(_match);
}

function displayGoToLastStep(_match) {
    _match.displayingMatchIndex = _match.displayingMatch.length - 1;
    displayStep(_match);
    displayStepButtons(_match);
}

function displayStep(_match) {
    document.getElementById("game").innerHTML = _match.displayingMatch[_match.displayingMatchIndex].game;
}

function displayStepButtons(_match) {
    if (_match.displayingMatchIndex <= 0) {
        document.getElementById("previous-step-button").style.opacity = 0.5;
        document.getElementById("first-step-button").style.opacity = 0.5;
    } else {
        document.getElementById("previous-step-button").style.opacity = 1;
        document.getElementById("first-step-button").style.opacity = 1;
    }

    if (_match.displayingMatchIndex >= _match.displayingMatch.length - 1) {
        document.getElementById("next-step-button").style.opacity = 0.5;
        document.getElementById("last-step-button").style.opacity = 0.5;
    } else {
        document.getElementById("next-step-button").style.opacity = 1;
        document.getElementById("last-step-button").style.opacity = 1;
    }
}