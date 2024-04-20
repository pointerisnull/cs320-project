const colorsFill = ["#cce5ff", "#d8e9b6", "#f0d6e1", "#fad8be", "#85c1ff"];
const colorsStroke = ["#0066cc", "#4d9900", "#cc0066", "#ff6633", "#99cc00", "#0077cc"];

// These next two functions (setBanner() and updateBanner()) displays and updates the banner that shows on the top of 
// the game container. The banner displays relevant information (i.e., whose turn it is and their color, phase, phase information, etc.).
function setBanner() {
    document.getElementById("banner").style.display = "flex";
}

function updateBanner(gameData) {
    var bannerText = document.getElementById("bannerText");
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

// Function to update each individual country and its info and set up the "info box" and hover events.
function setInfoBox(gameData) {
    const polygons = document.getElementById("riskSVGMap").contentDocument.getElementsByTagName("polygon");
    Array.from(polygons).forEach(polygon => {
        polygon.addEventListener('mouseenter', (event) => handlePolygonHover(event, gameData));
        polygon.addEventListener('mouseleave', () => {
            document.getElementById('infoBox').style.display = 'none';
        });
    });
}

// Function to handle mouse hover over polygons
function handlePolygonHover(event, gameData) {
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