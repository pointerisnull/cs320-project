// Function to retrieve the corresponding territory object given a specific polygon.
function findTerritoryByPolygonId(polygonId) {
    return gameData.territories.find(territory => territory.name === polygonId);
}

// Function to calculate distance between two points
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Function to determine adjacency between two countries (this isn't perfect but works for now).
function isAdjacent(attackerPolygonId, defenderPolygonId) {
    const attackerPolygon = document.getElementById("riskSVGMap").contentDocument.getElementById(attackerPolygonId);
    const defenderPolygon = document.getElementById("riskSVGMap").contentDocument.getElementById(defenderPolygonId);
    const attackerPolygonBounds = attackerPolygon.getBoundingClientRect();
    const defenderPolygonBounds = defenderPolygon.getBoundingClientRect();
    const distance = calculateDistance(attackerPolygonBounds.left, attackerPolygonBounds.top, defenderPolygonBounds.left, defenderPolygonBounds.top);

    // Check if the distance is below a threshold to consider them adjacent
    if (distance < 90 && attackerPolygon !== defenderPolygon) {
        return true;
    } else {
        return false;
    }
}

// These variables and functions below deal with the different times user input is needed to select a certain number of troops. 

var troopsAttackingCount = 1;

function increaseAttackingTroops() {
    if(attacker && troopsAttackingCount < findTerritoryByPolygonId(attacker).armies - 1 && findTerritoryByPolygonId(attacker).armies > 2) {
        troopsAttackingCount++;
    }
    document.getElementById('troopsAttackingCount').textContent = troopsAttackingCount;
}

function decreaseAttackingTroops() {
    if(troopsAttackingCount > 1) {
        troopsAttackingCount--;
    }
    document.getElementById('troopsAttackingCount').textContent = troopsAttackingCount;
}

var troopsToSendCount = 0;

function increaseTroopsToSend() {
    if(troopsToSendCount < findTerritoryByPolygonId(attacker).armies - 1 && findTerritoryByPolygonId(attacker).armies > 1) {
        troopsToSendCount++;
    }
    document.getElementById('troopsToSendCount').textContent = troopsToSendCount;
}

function decreaseTroopsToSend() {
    if(troopsToSendCount > 0) {
        troopsToSendCount--;
    }
    document.getElementById('troopsToSendCount').textContent = troopsToSendCount;
}

var fortifyTroopsToSendCount = 0;

function increaseFortifyTroopsToSend() {
    if(fortifyTroopsToSendCount < findTerritoryByPolygonId(firstTerritoryToFortify).armies - 1 && findTerritoryByPolygonId(firstTerritoryToFortify).armies > 1) {
        fortifyTroopsToSendCount++;
    }
    document.getElementById('fortifyTroopsToSendCount').textContent = fortifyTroopsToSendCount;
}

function decreaseFortifyTroopsToSend() {
    if(fortifyTroopsToSendCount > 0) {
        fortifyTroopsToSendCount--;
    }
    document.getElementById('fortifyTroopsToSendCount').textContent = fortifyTroopsToSendCount;
}

function skipAttackPhase() {
    document.getElementById('attackSelectScreen').style.display = 'none';
    document.getElementById('skipButtons').style.display = 'none';
    document.getElementById('skipAttackPhaseButton').style.display = 'none';
    attacker = null;
    defender = null;
    troopsAttackingCount = 1;
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    polygons.forEach(polygon => {
        polygon.removeEventListener('click', handleAttackFirstClick);
    });
    polygons.forEach(polygon => {
        polygon.removeEventListener('click', handleAttackSecondClick);
    });
    //removeShimmer();
    fortificationPhase();
}

function skipFortifyPhase() {
    document.getElementById("fortifySelectionScreen").style.display = 'none';
    document.getElementById('skipButtons').style.display = 'none';
    document.getElementById('skipFortifyPhaseButton').style.display = 'none';
    firstTerritoryToFortify = null;
    secondTerritoryToFortify = null;
    fortifyTroopsToSendCount = 0
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    polygons.forEach(polygon => {
        polygon.removeEventListener('click', handleFortifyFirstClick);
    });
    polygons.forEach(polygon => {
        polygon.removeEventListener('click', handleFortifySecondClick);
    });
    //removeShimmer();
    endCurrentTurn();
}