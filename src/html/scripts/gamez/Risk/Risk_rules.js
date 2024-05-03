// This function is called when the next turn is ready to be played. It plays out the entire current turn. It does this by setting off a chain of function calls, starting with the reinforcementPhase() function.
// The turn continues even after the reinforcementPhase() function as the next phase function is called inside the reinforcementPhase function and so on.
function nextTurn() {
    troopsAttackingCount = 1;
    troopsToSendCount = 0;
    fortifyTroopsToSendCount = 0;

    const bottomBannerText = document.getElementById("bottomBannerText");
    bottomBannerText.innerHTML = '';
    updateTerritoryColors();
    setInfoBox();
    setBanners();
    updateTopBanner();
    reinforcementPhase();
}

// This function encompasses the entire reinforcement phase. It updates the banner, calculates the number of reinforcements, updates 
// the game data, and sets the ability to click on polygons (which is used to divvy out reinforcements by the user).
function reinforcementPhase() {
    console.log("Reinforcement phase starting...")
    var topBannerText = document.getElementById("topBannerText");
    var bottomBannerText = document.getElementById("bottomBannerText");
    const currentPlayer = gameData.player_turn;
    var numberOfTerritories = 0;
    gameData.territories.forEach((territory) => {
        if (territory.owner === currentPlayer) {
            numberOfTerritories++;
        }
    })
    var numberOfReinforcements = Math.max(Math.floor(numberOfTerritories / 3), 3);
    gameData.reinforcements = numberOfReinforcements;
    topBannerText.innerHTML += " | You have " + gameData.reinforcements + " troops to place";
    bottomBannerText.innerHTML = "Please place your reinforcements";

    const polygons = document.getElementById("riskSVGMap").contentDocument.getElementsByTagName("polygon");
    Array.from(polygons).forEach(polygon => {
        polygon.addEventListener('click', handleReinforcementClick);
    });
}

// Function to initialize attack phase
function attackPhase() {
    console.log("Attack phase starting...")
    gameData.game_phase = 'attack';
    var bottomBannerText = document.getElementById("bottomBannerText");
    updateTopBanner();
    bottomBannerText.innerHTML = "Please select an attacker."

    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");

    // Add click event listeners to all countries for selecting attacker
    if (!attacker) {
        polygons.forEach(polygon => {
            polygon.addEventListener('click', handleAttackFirstClick);
        });
        polygons.forEach(polygon => {
            polygon.removeEventListener('click', handleAttackSecondClick);
        });
    }
}

function fortificationPhase() {
    document.getElementById("attackPhaseContinueOrOverScreen").style.display = "none";
    console.log("Fortification phase starting...");
    gameData.game_phase = 'fortify';
    var bottomBannerText = document.getElementById("bottomBannerText");
    bottomBannerText.innerHTML = "Choose two adjacent, owned territories to move troops between."
    updateTopBanner();

    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");

    polygons.forEach(polygon => {
        polygon.removeEventListener('click', handleAttackFirstClick);
    })
    polygons.forEach(polygon => {
        polygon.removeEventListener('click', handleAttackSecondClick);
    });

    polygons.forEach(polygon => {
        polygon.addEventListener('click', handleFortifyFirstClick);
    });
}

async function endCurrentTurn() {
    const win = checkWin();
    if (win != null) {
        gameData.game_phase = "End";

        const updated = await updateLocalRiskGameData();

        if (updated) { // Nothing implemented yet for when someone wins.
            //nextTurn();
        }
    }
    else {
        if (gameData.playerNames.indexOf(gameData.player_turn) < gameData.playerNames.length - 1) {
            gameData.player_turn = gameData.playerNames[gameData.playerNames.indexOf(gameData.player_turn) + 1];
        }
        else {
            gameData.player_turn = gameData.playerNames[0];
        }
        gameData.game_phase = "reinforcement";

        const updated = await updateLocalRiskGameData();

        if (updated) {
            nextTurn();
        }
    }
}

// This function is called at the end of every turn to check if a player has won or not.
function checkWin() {
    var playerTerritoryCounts = [];

    gameData.playerNames.forEach((player) => {
        playerTerritoryCounts.push({ playerName: player, territoryCount: 0 });
        gameData.territories.forEach((territory) => {
            if (territory.owner === player) {
                const index = playerTerritoryCounts.findIndex(object => object.playerName === player);
                if (index !== -1) {
                    playerTerritoryCounts[index].territoryCount += 1;
                }
            }
        });
    });

    // Check if any player owns all territories.
    const winner = playerTerritoryCounts.find(object => object.territoryCount === gameData.territories.length);
    return winner ? winner.playerName : null;
}

// if counting takes too long i made a version using booleans for the regions (I can make it db friendly tmr)
/*function checkWin(attacker) {
    const win = false;
    for (let j = o; j < territories.length; j++) { // check if attacker owns each territory
        if (territories[j].owner == attacker) {
            win = true;
        } else {
            win = false; // if any territory isnt owned by attacker, that can't win yet.
            break; // no need to keep looping
        };
    }
    return win; // return boolean value
}*/

function recievedCard(gainedTerritory) { // Not done or tested yet
    const currentPlayer = gameData.player_turn;
    var attackerCurrentTroops = findTerritoryByPolygonId(attacker).armies;
    var gainedTerritory = gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(attacker))].name;

    const cards = [gameData.Cards]; // player needs to recieve a card when aqured territory

    /*if (gainedTerritory == null) {
        return;
    } else if (/*get name of territory and match to card to get army amount*) { } */

    this.hand = []; // player hand of cards

    this.hand.push(card); // push recieved card to hand

    const sets = {};
    this.hand.forEach(card => { // create a set from matching troopTypes 
        sets[card.troopType] = sets[card.troopType] || [];
        sets[card.troopType].push(card);
    });
}

function tradeIn() {
    // trooptype army value
    const infantry = 1;
    const cavalry = 5;
    const artillery = 10;

    let reinforcements = 0;
    for (const troopType in recievedCard().sets) {
        const hand = sets[troopType];
        if (hand.length >= 3) { // if hand has a possible set
            const numSets = Math.floor(hand.length / 3); // possible sets
            // check if set cards have have troop type
            if (card.troopType == 'Infantry'){ // set reinforments based on set troopType
                reinforcements += infantry;
            } else if (card.troopType == 'Cavalry') {
                reinforcements += cavalry;
            } else if (card.troopType == 'Artillery') {
                reinforcements += artillery;
            }
            // reinforcements += numSets;
            console.log(`${this.name} traded ${numSets * 3} ${troopType} cards for ${reinforcements} troops.`);
        }
    }

    // Add reinforcements to player's army
    gameData.reinforcements += [reinforcements];

    // Remove traded cards from player's collection
    // recievedCard().hand = this.cards.filter(card => !tradedCards.includes(card));
}

function continentControl(attacker) { // player can get more troops depending on continent control (finding region control needs to be db friendly)
    var control = checkWin();
    /*for (let i = 0; i < connectedRegions.length; i++) { // check each region (record each region control & territory count to ensure correct # of recieved troops) Needs modified
        let region = connectedRegions[i];
        let territory = [region.connections];
        for (let j = o; j < territory.length; j++) { // check if attacker owns each territory in a region for each region
            if (territory[j].owner == attacker) {
                control = true;
            } else {
                control = false; // if any territory isnt owned by attacker, that can't win yet.
                break; // no need to keep looping
            };
        }*/
    if (control != null) { // increase possible # of troops in reinforce phase
        let count = control.playerTerritoryCounts;
        if (count <= 9) { 
            reinforcementPhase().gameData.reinforcements += 3; // always at least 3 armies for fewer than 9 territories
        } else if (count < 42) { // recieved army based on count
            let recieve = count / 3;
            reinforcementPhase().gameData.reinforcements += recieve;
        } else { // reset possible # of troops?
            reinforcementPhase().gameData.reinforcements += 0;
        }
    } else {
        reinforcementPhase().gameData.reinforcements += 3; // always at least 3 armies for fewer than 9 territories
    }

}

// This function takes the gameData object (which just has all the data about this specific local game of risk from the database) 
// and uses that to set the fill and stroke of each polygon (i.e., country) in the svg (which is embedded as an iframe which is why 
// we can't just do 'document.getElementById(...)'). As of right now, there is no way for a player to choose his/her own color, the 
// colors are decided based on the order of the player array or, in other words, the order in which the user puts in the player names.
function updateTerritoryColors() {
    // This below is getting all the elements from the html file that has the svg in it. Being that this html file is embedded as an iframe 
    // in the risk.html file, we have to reference that iframe first before accessing its elements.
    const polygons = document.getElementById("riskSVGMap").contentWindow.document.getElementsByTagName("polygon");
    const polygonIds = [];

    // Getting each individual polygon id (e.g., 'Alaska', 'China', etc.) from the polygons array.
    for (i = 0; i < polygons.length; i++) {
        const polygonId = polygons[i].getAttribute("id");
        polygonIds.push(polygonId);
    }

    // This iterates over the territories array and over every iteration also iterates over a for-loop which is trying to find what 
    // polygon id from the polygonIds array matches with the current 'territory' object.
    gameData.territories.forEach((territory) => {
        for (i = 0; i < gameData.territories.length; i++) {
            if (territory.name === polygonIds[i]) {
                const country = document.getElementById("riskSVGMap").contentWindow.document.getElementById(polygonIds[i]);
                if (country) {
                    country.style.fill = colorsFill[gameData.playerNames.indexOf(territory.owner)];
                    country.style.stroke = colorsStroke[gameData.playerNames.indexOf(territory.owner)];
                }
            }
        }
    });
}

// These last few functions deal with handling click and hover events.

// Function to handle mouse click on polygons
function handleReinforcementClick(event) {
    const polygon = event.target;
    const country = polygon.id;
    var topBannerText = document.getElementById("topBannerText");

    if (gameData.reinforcements > 0 && gameData.game_phase === 'reinforcement') {
        gameData.territories.forEach((territory) => {
            if (territory.name === country) {
                if (gameData.player_turn === territory.owner) {
                    gameData.reinforcements--;
                    territory.armies += 1;
                    updateTopBanner();
                    updateInfoBox(territory);
                    topBannerText.innerHTML += " | You have " + gameData.reinforcements + " troops to place";
                    if (gameData.reinforcements === 0) {
                        console.log("Reinforcement phase over...");
                        const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");

                        polygons.forEach(polygon => {
                            polygon.removeEventListener('click', handleReinforcementClick);
                        })
                        attackPhase();
                    }
                }
            }
        });
    }
}

let attacker = null; // Variable to store the attacking country
let defender = null;

// Function to handle the first click (selecting the attacker)
function handleAttackFirstClick(event) {
    const clickedPolygon = event.target;
    const currentPlayer = gameData.player_turn;
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    var bottomBannerText = document.getElementById("bottomBannerText");

    if (attacker === null) {
        // Check if the clicked country belongs to the current player
        if (findTerritoryByPolygonId(clickedPolygon.id).owner === currentPlayer && findTerritoryByPolygonId(clickedPolygon.id).armies > 1) {
            // Add shimmering effect to the clicked country
            clickedPolygon.classList.add('shimmer');
            attacker = clickedPolygon.id;
            console.log(`Attacker selected: ${attacker}`);
            bottomBannerText.innerHTML = "Please select a target (must be adjacent).";
            // Add click event listeners to all countries for selecting defender.
            if (attacker) {
                polygons.forEach(polygon => {
                    polygon.removeEventListener('click', handleAttackFirstClick);
                })
                polygons.forEach(polygon => {
                    polygon.addEventListener('click', handleAttackSecondClick);
                });
            }
        } else if (findTerritoryByPolygonId(clickedPolygon.id).owner === currentPlayer && findTerritoryByPolygonId(clickedPolygon.id).armies <= 1) {
            console.log("An attacking territory must have at least 2 troops!");
            bottomBannerText.innerHTML = "An attacking territory must have at least 2 troops! Please select an attacker.";
        }
        else {
            console.log("You can only select your own territories as attackers.");
            bottomBannerText.innerHTML = "You can only select your own territories as attackers! Please select an attacker.";
        }
    }
}

// Function to handle the second click (selecting the defender)
function handleAttackSecondClick(event) {
    const clickedPolygon = event.target;
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    var bottomBannerText = document.getElementById("bottomBannerText");

    // Check if the clicked country is adjacent to the attacker
    if (attacker) {
        if (findTerritoryByPolygonId(clickedPolygon.id).owner === gameData.player_turn) {
            bottomBannerText.innerHTML = "You can't attack your own countries! Please select a target."
            console.log("You can't attack your own countries!");
        }
        else if (isAdjacent(attacker, clickedPolygon.id)) {
            // Add shimmering effect to the clicked country
            clickedPolygon.classList.add('shimmer');
            defender = clickedPolygon.id;
            console.log(`Target selected: ${defender}`);
            bottomBannerText.innerHTML = "Attacker: " + attacker + " | Target: " + defender;
            displayAttackSelectScreen(attacker, defender);
            polygons.forEach(polygon => {
                polygon.removeEventListener('click', handleAttackSecondClick);
            })
            polygons.forEach(polygon => {
                polygon.addEventListener('click', handleAttackFirstClick);
            });
        } else {
            bottomBannerText.innerHTML = "You can only attack adjacent territories! Please select a target."
            console.log("You can only attack adjacent territories!");
        }
    }
}

var firstTerritoryToFortify = null;
var secondTerritoryToFortify = null;

function handleFortifyFirstClick(event) {
    const clickedPolygon = event.target;
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    var bottomBannerText = document.getElementById("bottomBannerText");

    if (findTerritoryByPolygonId(clickedPolygon.id).owner === gameData.player_turn) {
        if (findTerritoryByPolygonId(clickedPolygon.id).armies > 1) {
            clickedPolygon.classList.add('shimmer');
            firstTerritoryToFortify = clickedPolygon.id;
            console.log(`First territory selected: ${firstTerritoryToFortify}`);
            polygons.forEach(polygon => {
                polygon.removeEventListener('click', handleFortifyFirstClick);
            })
            polygons.forEach(polygon => {
                polygon.addEventListener('click', handleFortifySecondClick);
            });
        }
        else {
            console.log("You can only select territories with at least 2 troops!");
            bottomBannerText.innerHTML = "You can only select territories with at least 2 troops!";
        }
    }
    else {
        console.log("You can only select your own territories!");
        bottomBannerText.innerHTML = "You can only select your own territories!";
    }
}

function handleFortifySecondClick(event) {
    const clickedPolygon = event.target;
    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    var bottomBannerText = document.getElementById("bottomBannerText");

    if (findTerritoryByPolygonId(clickedPolygon.id).owner === gameData.player_turn) {
        if (isAdjacent(firstTerritoryToFortify, clickedPolygon.id)) {
            clickedPolygon.classList.add('shimmer');
            secondTerritoryToFortify = clickedPolygon.id;

            polygons.forEach(polygon => {
                polygon.removeEventListener('click', handleFortifyFirstClick);
            })
            polygons.forEach(polygon => {
                polygon.removeEventListener('click', handleFortifySecondClick);
            });
            displayFortifySelectionScreen();
        }
        else {
            console.log("You can only select adjacent territories!");
            bottomBannerText.innerHTML = "You can only select adjacent territories!";
        }
    }
    else {
        console.log("You can only select territories that you own!");
        bottomBannerText.innerHTML = "You can only select territories that you own!";
    }
}

// This function is called when the current player selects two valid territories and the number of troops to send. This function encapsulates the entire attack.
function singleAttack() {
    document.getElementById('attackSelectScreen').style.display = 'none';
    var attackerLostTroops = 0;
    var defenderLostTroops = 0;
    var attackerCurrentTroops = findTerritoryByPolygonId(attacker).armies;
    var defenderCurrentTroops = findTerritoryByPolygonId(defender).armies;
    // var attackerBeginningTroops = attackerCurrentTroops;
    // var defenderBeginningTroops = defenderCurrentTroops;
    var randomValue = 0;
    var winner = null;
    var loser = null;
    var bottomBannerText = document.getElementById("bottomBannerText");
    const attackSummaryScreen = document.getElementById('attackSummaryScreen');

    while (attackerCurrentTroops > 0 && defenderCurrentTroops > 0) {
        randomValue = Math.random();
        if (randomValue < 0.5) {
            defenderLostTroops++;
            defenderCurrentTroops--;
        }
        else {
            attackerLostTroops++;
            attackerCurrentTroops--;
        }
        console.log(attacker, ": ", attackerCurrentTroops);
        console.log(defender, ": ", defenderCurrentTroops);
    }

    if (attackerCurrentTroops) {
        winner = attacker;
        loser = defender;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(attacker))].armies = attackerCurrentTroops;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].armies = defenderCurrentTroops + 1;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].owner = findTerritoryByPolygonId(attacker).owner;
        updateTerritoryColors();
        bottomBannerText.innerHTML = "You successfully invaded " + loser + "!";
        attackSummaryScreen.innerHTML = `
        <div>${attacker} lost ${attackerLostTroops} troop(s)</div>
        <div>${defender} lost ${defenderLostTroops} troop(s)</div>
        <hr></hr>
        <div>${winner} beat ${loser}</div>
        <hr></hr>
        <button onclick="hideAttackSummaryScreen(); displayTroopSendScreen();">Ok</button>
        `;
    }
    else {
        winner = defender;
        loser = attacker;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(attacker))].armies = attackerCurrentTroops + 1;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].armies = defenderCurrentTroops;
        attackSummaryScreen.innerHTML = `
        <div>${attacker} lost ${attackerLostTroops} troop(s)</div>
        <div>${defender} lost ${defenderLostTroops} troop(s)</div>
        <div>${loser} beat ${winner}</div>
        <br></br>
        <button onclick="hideAttackSummaryScreen(); displayAttackPhaseContinueOrOverScreen();">Ok</button>
        `;
    }

    removeShimmer();
    attackSummaryScreen.style.display = 'block';
}

function cancelAttack() {
    document.getElementById('attackSelectScreen').style.display = 'none';
    attacker = null;
    defender = null;
    removeShimmer();
    troopsAttackingCount = 1;
    attackPhase();
}