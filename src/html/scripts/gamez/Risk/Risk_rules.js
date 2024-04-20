// This function is called when the next turn is ready to be played. It plays out the entire current turn. It does this by setting off a chain of function calls, starting with the reinforcementPhase() function.
// The turn continues even after the reinforcementPhase() function as the next phase function is called inside the reinforcementPhase function and so on.
function nextTurn(gameData) {
    reinforcementPhase(gameData);
}

// This function encompasses the entire reinforcement phase. It updates the banner, calculates the number of reinforcements, updates 
// the game data, and sets the ability to click on polygons (which is used to divvy out reinforcements by the user).
function reinforcementPhase(gameData) {
    console.log("Reinforcement phase starting...")
    var bannerText = document.getElementById("bannerText");
    const currentPlayer = gameData.player_turn;
    var numberOfTerritories = 0;
    gameData.territories.forEach((territory) => {
        if(territory.owner === currentPlayer) {
            numberOfTerritories++;
        }
    })
    var numberOfReinforcements = Math.max(Math.floor(numberOfTerritories / 3), 3);
    gameData.reinforcements = numberOfReinforcements;
    bannerText.innerHTML += " | You have " + gameData.reinforcements + " troops to place";

    const polygons = document.getElementById("riskSVGMap").contentDocument.getElementsByTagName("polygon");
    Array.from(polygons).forEach(polygon => {
        polygon.addEventListener('click', (event) => handlePolygonClick(event, gameData));
    });
}

// Function to initialize attack phase
function attackPhase(gameData) {
    console.log("Attack phase starting...")
    gameData.game_phase = 'attack';
    updateBanner(gameData);

    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");

    // Add click event listeners to all countries for selecting attacker
    if(!attacker) {
        polygons.forEach(polygon => {
            polygon.addEventListener('click', (event) => handleFirstClick(event, gameData));
        });
    }
}

// This function is called at the end of every turn to check if a player has won or not.
function checkWin(gameData) {

}


// This function takes the gameData object (which just has all the data about this specific local game of risk from the database) 
// and uses that to set the fill and stroke of each polygon (i.e., country) in the svg (which is embedded as an iframe which is why 
// we can't just do 'document.getElementById(...)'). As of right now, there is no way for a player to choose his/her own color, the 
// colors are decided based on the order of the player array or, in other words, the order in which the user puts in the player names.
function updateTerritoryColors(gameData) {
    // This below is getting all the elements from the html file that has the svg in it. Being that this html file is embedded as an iframe 
    // in the risk.html file, we have to reference that iframe first before accessing its elements.
    const polygons = document.getElementById("riskSVGMap").contentWindow.document.getElementsByTagName("polygon");
    const polygonIds = [];

    // Getting each individual polygon id (e.g., 'Alaska', 'China', etc.) from the polygons array.
    for(i = 0; i < polygons.length; i++) {
        const polygonId = polygons[i].getAttribute("id");
        polygonIds.push(polygonId);
    }

    // This iterates over the territories array and over every iteration also iterates over a for-loop which is trying to find what 
    // polygon id from the polygonIds array matches with the current 'territory' object.
    gameData.territories.forEach((territory) => {
        for(i = 0; i < gameData.territories.length; i++) {
            if(territory.name === polygonIds[i]) {
                const country = document.getElementById("riskSVGMap").contentWindow.document.getElementById(polygonIds[i]);
                if(country) {
                    country.style.fill = colorsFill[gameData.playerNames.indexOf(territory.owner)];
                    country.style.stroke = colorsStroke[gameData.playerNames.indexOf(territory.owner)];
                }
            }
        }
    });
}

// These last few functions deal with handling click and hover events.

// Function to handle mouse click on polygons
function handlePolygonClick(event, gameData) {
    const polygon = event.target;
    const country = polygon.id;
    var bannerText = document.getElementById("bannerText");
    
    if(gameData.reinforcements > 0 && gameData.game_phase === 'reinforcement') {
        gameData.territories.forEach((territory) => {
            if(territory.name === country) {
                if(gameData.player_turn === territory.owner) {
                    gameData.reinforcements--;
                    territory.armies += 1;
                    updateBanner(gameData);
                    bannerText.innerHTML += " | You have " + gameData.reinforcements + " troops to place";
                    if(gameData.reinforcements === 0) {
                        console.log("Reinforcement phase over...");
                        attackPhase(gameData);
                    }
                }
            }
        });
    }
}

let attacker = null; // Variable to store the attacking country

// Function to handle the first click (selecting the attacker)
function handleFirstClick(event, gameData) {
    const clickedPolygon = event.target;
    const currentPlayer = gameData.player_turn;
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");

    if(attacker === null) {
        // Check if the clicked country belongs to the current player
        if (findTerritoryByPolygonId(gameData.territories, clickedPolygon.id).owner === currentPlayer) {
            attacker = clickedPolygon.id;
            console.log(`Attacker selected: ${attacker}`);
            // Add click event listeners to all countries for selecting defender.
            if(attacker) {
                polygons.forEach(polygon => {
                    polygon.removeEventListener('click', (event) => handleFirstClick(event, gameData));
                })
                polygons.forEach(polygon => {
                    polygon.addEventListener('click', (event) => handleSecondClick(event, gameData));
                });
            }
        } else {
            console.log("You can only select your own territories as attackers.");
        }
    }
}

// Function to handle the second click (selecting the defender)
function handleSecondClick(event, gameData) {
    const clickedPolygon = event.target;
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");

    // Check if the clicked country is adjacent to the attacker
    if(attacker) {
        if (isAdjacent(attacker, clickedPolygon.id)) {
            const defender = clickedPolygon.id;
            console.log(`Defender selected: ${defender}`);
            attacker = null;
            polygons.forEach(polygon => {
                polygon.removeEventListener('click', (event) => handleSecondClick(event, gameData));
            })
            polygons.forEach(polygon => {
                polygon.addEventListener('click', (event) => handleFirstClick(event, gameData));
            });
        } else {
            console.log("You can only attack adjacent territories.");
        }
    }
}