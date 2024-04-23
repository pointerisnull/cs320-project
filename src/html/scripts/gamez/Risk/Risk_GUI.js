const colorsFill = ["#cce5ff", "#d8e9b6", "#f0d6e1", "#fad8be", "#85c1ff"];
const colorsStroke = ["#0066cc", "#4d9900", "#cc0066", "#ff6633", "#99cc00", "#0077cc"];

// These next two functions (setBanners() and updateBanner()) displays and updates the banner that shows on the top of 
// the game container. The banner displays relevant information (i.e., whose turn it is and their color, phase, phase information, etc.).
function setBanners() {
    document.getElementById("topBanner").style.display = "flex";
    document.getElementById("bottomBanner").style.display = "flex";
}

function updateTopBanner() {
    var bannerText = document.getElementById("topBannerText");
    var phase = gameData.game_phase;
    phase = phase.charAt(0).toUpperCase() + phase.substring(1, phase.length); // Capitalize first letter
    phase = phase.replace(/_/g, " "); // Replace underscores with spaces

    // Capitalize letter after space
    for(i = 0; i < phase.length; i++) {
        if(phase[i] === " ") {
            phase = phase.substring(0, i + 1) + phase.charAt(i + 1).toUpperCase() + phase.substring(i + 2);
        }
    }

    bannerText.innerHTML = gameData.player_turn +  "'s Turn: " + colorsFill[gameData.playerNames.indexOf(gameData.player_turn)] + " | Phase: " + phase;
}

function updateBottomBanner() {

}

// Function to update each individual country and its info and set up the "info box" and hover events.
function setInfoBox() {
    const polygons = document.getElementById("riskSVGMap").contentDocument.getElementsByTagName("polygon");
    Array.from(polygons).forEach(polygon => {
        polygon.addEventListener('mouseenter', handlePolygonHover);
        polygon.addEventListener('mouseleave', () => {
            document.getElementById('infoBox').style.display = 'none';
        });
    });
}

// Function to handle mouse hover over polygons
function handlePolygonHover(event) {
    const polygon = event.target;
    const country = polygon.id;
    const infoBox = document.getElementById('infoBox');
    gameData.territories.forEach((territory) => {
        if (territory.name === country) {
            infoBox.innerHTML = `
                <div>Owner: ${territory.owner}</div>
                <div>Troop Count: ${territory.armies}</div>
            `;
        }
    });
    infoBox.style.display = 'block';
    // Position the info box near the hovered polygon
    const rect = polygon.getBoundingClientRect();
    if(rect.right >= 600) {
        infoBox.style.top = rect.top + 'px';
        infoBox.style.left = rect.left - 100 + 'px'; // Position it to the right of the polygon
    }
    else {
        infoBox.style.top = rect.top + 'px';
        infoBox.style.left = rect.right + 'px'; // Position it to the right of the polygon
    }
}

function displayAttackSelectScreen(attackerId, targetId) {
    const attackSelectScreen = document.getElementById('attackSelectScreen');
    if(findTerritoryByPolygonId(attacker).armies < 3) {
        troopsAttackingCount = 0;
    }
    attackSelectScreen.innerHTML = `
    <div>Attacker: ${attackerId}; Troop Count: ${findTerritoryByPolygonId(attackerId).armies}</div>
    <div>Target: ${targetId}; Troop Count: ${findTerritoryByPolygonId(targetId).armies}</div>
    <div>How many troops do you want to send into battle: </div>
    <button onclick="decreaseAttackingTroops()" style="width:10%">-</button>
    <span id="troopsAttackingCount">1</span>
    <button onclick="increaseAttackingTroops()" style="width:10%">+</button>
    <br></br>
    <button onclick="startAttack()">Attack!</button>
    `;
    attackSelectScreen.style.display = 'block';
}

function hideAttackSummaryScreen() {
    const attackSummaryScreen = document.getElementById('attackSummaryScreen');
    attackSummaryScreen.style.display = 'none';
    displayTroopSendScreen();
}

function displayTroopSendScreen() {
    const troopSendScreen = document.getElementById('troopSendScreen');
    troopSendScreen.innerHTML = `
    <div>Number of troops to send from ${attacker} to ${defender}: <span id="troopsToSendCount">1</span></div>
    <button onclick="decreaseTroopsToSend()" style="width:10%">-</button>
    <button onclick="increaseTroopsToSend()" style="width:10%">+</button>
    <br></br>
    <button onclick="hideTroopSendScreen()">Ok</button>
    `;
    troopSendScreen.style.display = 'block';
}

function hideTroopSendScreen() {
    const troopSendScreen = document.getElementById("troopSendScreen");
    var bottomBannerText = document.getElementById("bottomBannerText");
    troopSendScreen.style.display = 'none';
    gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].armies = troopsToSendCount + 1;
    gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(attacker))].armies -= troopsToSendCount;
    attacker = null;
    defender = null;
    bottomBannerText.innerHTML = "Choose another attacker or move on to the fortification phase...";
    displayAttackPhaseContinueOrOverScreen();
}

function displayAttackPhaseContinueOrOverScreen() {
    const attackPhaseContinueOrOverScreen = document.getElementById("attackPhaseContinueOrOverScreen");
    attackPhaseContinueOrOverScreen.style.display = 'block';
}

function hideAttackPhaseContinueOrOverScreen() {
    const attackPhaseContinueOrOverScreen = document.getElementById("attackPhaseContinueOrOverScreen");
    attackPhaseContinueOrOverScreen.style.display = 'none';
}

function displayFortifySelectionScreen() {
    const fortifySelectionScreen = document.getElementById("fortifySelectionScreen");

    fortifySelectionScreen.innerHTML = `
    <div>Number of troops to send from ${firstTerritoryToFortify} to ${secondTerritoryToFortify}: <span id="fortifyTroopsToSendCount">1</span></div>
    <button onclick="decreaseFortifyTroopsToSend()" style="width:10%">-</button>
    <button onclick="increaseFortifyTroopsToSend()" style="width:10%">+</button>
    <br></br>
    <button onclick="hideFortifySelectionScreen()">Ok</button>
    `;
    fortifySelectionScreen.style.display = 'block';
}

function hideFortifySelectionScreen() {
    const fortifySelectionScreen = document.getElementById("fortifySelectionScreen");
    fortifySelectionScreen.style.display = 'none';

    firstTerritoryToFortify = null;
    secondTerritoryToFortify = null;
    endCurrentTurn();
}