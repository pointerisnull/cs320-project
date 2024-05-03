const colorsFill = ["#cce5ff", "#d8e9b6", "#f0d6e1", "#fad8be", "#e2f0cb", "#85c1ff"];
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

let isInfoBoxHovered = false; // Flag to track if the mouse is over the infobox

// Function to update each individual country and its info and set up the "info box" and hover events.
function setInfoBox() {
    const infoBox = document.getElementById('infoBox');

    // Add event listener to the info box to handle mouse enter and leave
    infoBox.addEventListener('mouseenter', () => {
        isInfoBoxHovered = true;
        infoBox.style.display = "block";
    });
    infoBox.addEventListener('mouseleave', () => {
        isInfoBoxHovered = false;
        hideInfoBox(); // Hide the infobox when mouse leaves it
    });

    const polygons = document.getElementById("riskSVGMap").contentDocument.getElementsByTagName("polygon");
    Array.from(polygons).forEach(polygon => {
        polygon.addEventListener('mouseenter', handlePolygonHover);
        polygon.addEventListener('mouseleave', handlePolygonLeave);
    });
}

function updateInfoBox(territory) {
    const infoBox = document.getElementById('infoBox');
    infoBox.innerHTML = `
        <div class="popup_screen_text">
            <div><span class="popup_screen_text_headers">Owner:</span> ${territory.owner}</div>
            <div><span class="popup_screen_text_headers">Troop Count:</span> ${territory.armies}</div>
        </div>
    `;
}

// Function to handle mouse hover over polygons
function handlePolygonHover(event) {
    const polygon = event.target;
    const country = polygon.id;
    const infoBox = document.getElementById('infoBox');
    gameData.territories.forEach((territory) => {
        if (territory.name === country) {
            infoBox.innerHTML = `
                <div class="popup_screen_text">
                    <div><span class="popup_screen_text_headers">Owner:</span> ${territory.owner}</div>
                    <div><span class="popup_screen_text_headers">Troop Count:</span> ${territory.armies}</div>
                </div>
            `;
        }
    });

    // Calculate the position of the info box
    const rect = polygon.getBoundingClientRect();
    let topPosition = rect.top - infoBox.offsetHeight - 10; // Offset to position slightly above the polygon
    let leftPosition = rect.left + (rect.width / 2) - (infoBox.offsetWidth / 2); // Center horizontally

    // Adjust position if near the edge of the container
    if (leftPosition < 0) {
        leftPosition = 10; // Move to the left edge
    } else if (leftPosition + infoBox.offsetWidth > window.innerWidth) {
        leftPosition = window.innerWidth - infoBox.offsetWidth - 10; // Move to the right edge
    }

    // Set the position of the info box
    infoBox.style.top = `${topPosition}px`;
    infoBox.style.left = `${leftPosition}px`;

    // Display the info box if the mouse is not over it
    if (!isInfoBoxHovered) {
        infoBox.style.display = 'block';
    }
}

function handlePolygonLeave() {
    if (!isInfoBoxHovered) {
        hideInfoBox();
    }
}

// Function to hide the info box
function hideInfoBox() {
    const infoBox = document.getElementById('infoBox');
    infoBox.style.display = 'none';
}

function displayAttackSelectScreen(attackerId, targetId) {
    const attackSelectScreen = document.getElementById('attackSelectScreen');
    if(findTerritoryByPolygonId(attacker).armies < 3) {
        troopsAttackingCount = 0;
    }
    attackSelectScreen.innerHTML = `
    <div class="popup_screen_text">
        <hr></hr>
        <div><span class="popup_screen_text_headers">Attacker:</span> ${attackerId}</div>
        <div><span class="popup_screen_text_headers">Troop Count:</span> ${findTerritoryByPolygonId(attackerId).armies}</div>
        <hr></hr>
        <div><span class="popup_screen_text_headers">Target:</span> ${targetId}</div>
        <div><span class="popup_screen_text_headers">Troop Count:</span> ${findTerritoryByPolygonId(targetId).armies}</div>
        <hr></hr>
        <div><span class="popup_screen_text_headers">How many troops do you want to send into battle:</span> </div>
        <button onclick="decreaseAttackingTroops()" style="width:10%">-</button>
        <span id="troopsAttackingCount">1</span>
        <button onclick="increaseAttackingTroops()" style="width:10%">+</button>
        <br></br>
        <button onclick="singleAttack()">Attack!</button>
    </div>
    `;
    attackSelectScreen.style.display = 'block';
}

// The functions below deal with displaying and hiding the various screens that pop up throughout one turn.

function hideAttackSummaryScreen() {
    const attackSummaryScreen = document.getElementById('attackSummaryScreen');
    attackSummaryScreen.style.display = 'none';
}

function displayTroopSendScreen() {
    const troopSendScreen = document.getElementById('troopSendScreen');
    troopSendScreen.innerHTML = `
    <div class="popup_screen_text">
        <div><span class="popup_screen_text_headers">Number of troops to send from ${attacker} to ${defender}:</span> <span id="troopsToSendCount">1</span></div>
        <button onclick="decreaseTroopsToSend()" style="width:10%">-</button>
        <button onclick="increaseTroopsToSend()" style="width:10%">+</button>
        <br></br>
        <button onclick="hideTroopSendScreen()">Ok</button>
    </div>
    `;
    troopSendScreen.style.display = 'block';
}

function hideTroopSendScreen() {
    const troopSendScreen = document.getElementById("troopSendScreen");
    var bottomBannerText = document.getElementById("bottomBannerText");
    troopSendScreen.style.display = 'none';
    gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(attacker))].armies -= troopsToSendCount;
    gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].armies += troopsToSendCount;
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
    <div class="popup_screen_text">
        <div><span class="popup_screen_text_headers">Number of troops to send from ${firstTerritoryToFortify} to ${secondTerritoryToFortify}:</span> <span id="fortifyTroopsToSendCount">1</span></div>
        <button onclick="decreaseFortifyTroopsToSend()" style="width:10%">-</button>
        <button onclick="increaseFortifyTroopsToSend()" style="width:10%">+</button>
        <br></br>
        <button onclick="hideFortifySelectionScreen()">Ok</button>
    </div>
    `;
    fortifySelectionScreen.style.display = 'block';
}

function hideFortifySelectionScreen() {
    const fortifySelectionScreen = document.getElementById("fortifySelectionScreen");
    fortifySelectionScreen.style.display = 'none';
    gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(firstTerritoryToFortify))].armies -= fortifyTroopsToSendCount;
    gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(secondTerritoryToFortify))].armies += fortifyTroopsToSendCount;
    firstTerritoryToFortify = null;
    secondTerritoryToFortify = null;
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    polygons.forEach(element => {
        // Check if the element has the class you want to remove
        if(element.classList.contains('shimmer')) {
            // If it has the class, remove it
            element.classList.remove('shimmer');
        }
    })
    endCurrentTurn();
}