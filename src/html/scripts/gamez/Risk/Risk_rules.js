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
    
    if(gameData.player_turn.indexOf('Computer') === -1) {
        bottomBannerText.innerHTML = '';
        reinforcementPhase();
    }
    else {
        bottomBannerText.innerHTML = 'Computer player is thinking...';
        computerReinforcementPhase();
    }
}

// Function to get the index of a player by name
function getPlayerIndexByName(playerName) {
    for (var i = 0; i < gameData.players.length; i++) {
        if (gameData.players[i].name === playerName) {
            return i; // Return the index of the player with the matching name
        }
    }
    // If the player with the given name is not found, return -1 or handle accordingly
    return -1;
}

// Function to get the index of a card by name
function getCardIndexByName(gainedCard) {
    for (var i = 0; i < gameData.Cards.length; i++) {
        if (gameData.Cards[i].territory.name === gainedCard) {
            return i; // Return the index of the card with the matching territory
        }
    }
    // If the card with the given name is not found, return -1 or handle accordingly
    return -1;
}

function reinforcementsEarned() {
    const currentPlayer = gameData.player_turn;
    var numberOfTerritories = 0;
    gameData.territories.forEach((territory) => {
        if (territory.owner === currentPlayer) {
            numberOfTerritories++;
        }
    });

    return Math.max(Math.floor(numberOfTerritories / 3), 3);
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
    var currentPlayer_index = getPlayerIndexByName(currentPlayer);
    //var currentPlayer_index = gameData.players.name.indexof(currentPlayer);

    if (currentPlayer_index !== -1) {
        gameData.players[currentPlayer_index].reinforcements += numberOfReinforcements;
        console.log(continentControl(gameData.control));
        console.log(tradeIn(gameData.players[currentPlayer_index].reinforcements));
    } else {
        console.log("Player not found!");
    }

    topBannerText.innerHTML += " | You have " + gameData.players[currentPlayer_index].reinforcements + " troops to place";
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
    document.getElementById('skipButtons').style.display = 'block';
    document.getElementById('skipAttackPhaseButton').style.display = 'block';

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

    document.getElementById('skipButtons').style.display = 'block';
    document.getElementById('skipFortifyPhaseButton').style.display = 'block';

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

        const updated = await updateRiskGameData();

        console.log(updated);
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

        const updated = await updateRiskGameData();

        console.log(updated);
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
                    // Update text color based on fill color
                    let nextSibling = country.nextSibling; // Start with the next sibling
                    while (nextSibling) {
                        if (nextSibling.nodeName === 'text') {
                            // Found the <text> element
                            nextSibling.style.fill = colorsText[gameData.playerNames.indexOf(territory.owner)];
                            break; // Exit the loop
                        }
                        nextSibling = nextSibling.nextSibling; // Move to the next sibling
                    }
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
    var currentPlayer_index = getPlayerIndexByName(gameData.player_turn);

    if (currentPlayer_index !== -1) {
        if (gameData.players[currentPlayer_index].reinforcements > 0 && gameData.game_phase === 'reinforcement') { //
            gameData.territories.forEach((territory) => {
                if (territory.name === country) {
                    if (gameData.player_turn === territory.owner) {
                        gameData.players[currentPlayer_index].reinforcements--;
                        territory.armies += 1;
                        updateTopBanner();
                        updateInfoBox(territory);
                        topBannerText.innerHTML += " | You have " + gameData.players[currentPlayer_index].reinforcements + " troops to place";
                        if (gameData.players[currentPlayer_index].reinforcements === 0) {
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
    } else {
        console.log("Player not found!");
    }
}

function continentControl(continents) { // player can get more troops depending on continent control (check before each turn)
    // continents = [gameData.control];
    var control = [];

    let allTerritoriesOwned = true; // track if all territories in the continent are owned by same player

    for (i = 0; i < control.length; i++) {
        let continentOwner = continents[i].owner; // temp default owner of the continent
        continents.forEach(connections => { // get each territory for each connection
            connections.forEach(territory => {
                for (territory of connections) { // check territories in the continent
                    const territoryOwner = territory.owner; // territories[territory.owner]; // get territory owner
                    if (territoryOwner !== continentOwner) {// If the territory owner is different from the owner of the continent
                        if (continentOwner === null) { // update the continent owner
                            continentOwner = territoryOwner;
                        } else {
                            allTerritoriesOwned = false;
                            break; // Exit loop early if multiple players own territories in the continent
                        }
                    }
                }
                // when all territories in the continent are owned by the same player, update the continent owner
                if (allTerritoriesOwned) {
                    control.push(control[i].region);
                }
            });
        });
    }
    var currentPlayer_index = getPlayerIndexByName(gameData.player_turn);

    if (currentPlayer_index !== -1) {
        // increase possible # of troops in reinforce phase
        if (control.length <= 0) { // if no control
            var playerTerritoryCounts = []; // check territory ownership for reinforcments

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

            let count = playerTerritoryCounts.length; //

            if (count <= 9) {
                gameData.players[currentPlayer_index].reinforcements += 3; // always at least 3 armies for fewer than 9 territories
            } else if (count < 42) { // recieved army based on count
                let recieve = count / 3;
                gameData.players[currentPlayer_index].reinforcements += recieve;
            } else { // reset possible # of troops?
                gameData.players[currentPlayer_index].reinforcements = 3;
                return;
            }
        } else { // Africa: 3; Asia: 7; Australia: 2; Europe: 5; North America: 5; South America: 2
            if (control.includes("North America") == true) { // recieved army based on continent control
                gameData.players[currentPlayer_index].reinforcements += 5;//reinforcementPhase().gameData.players[currentPlayer_index].reinforcements += 5;
            } else if (control.includes("South America") == true) { // recieved army based on continent control
                gameData.players[currentPlayer_index].reinforcements += 2;
            } else if (control.includes("Europe") == true) { // recieved army based on continent control
                gameData.players[currentPlayer_index].reinforcements += 5;
            } else if (control.includes("Australia") == true) { // recieved army based on continent control
                gameData.players[currentPlayer_index].reinforcements += 2;
            } else if (control.includes("Asia") == true) { // recieved army based on continent control
                gameData.players[currentPlayer_index].reinforcements += 7;
            }
        }
    } else {
        console.log("Player not found!");
    }

    return control; // might have into add in players object
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

 const territories = gameData.territories;
// Function to remove card from a specific array
function removeCardFromArray(card, array) {
    const index = array.indexOf(card);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

// Function to add card to a specific array
function addCardToArray(card, array) {
    array.push(card);
}

function recieveCard(gainedTerritory) { // needs graphics
    let gainedCard = gainedTerritory;
    const cardIndex = getCardIndexByName(gainedCard);

    var deck = gameData.Cards;
    // const cardIndex = deck.indexOf(gainedCard); // get card from name of gained territory
    gainedCard = deck[cardIndex];

    var currentPlayer_index = getPlayerIndexByName(gameData.player_turn);
    //const gainedCard = singleAttack().findTerritoryByPolygonId(attacker).name; // name of territory just won in attack;

    if (currentPlayer_index !== -1) {
        var hand = gameData.players[currentPlayer_index].hand;
        if (hand.includes(gainedCard)) {
            console.log("Player already has card for this territory.");
            return hand;
        }
        if (cardIndex !== -1) {
            // deck.splice(cardIndex, 1); // remove card from deck?
            removeCardFromArray(gainedCard, deck)
            hand.push(gainedCard);// add card to player hand
            console.log("Gained %s card", gainedCard.territory.name); // change output
            return hand;
        } else {
            console.log("Card not found in deck");
            return hand;
        }
    } else {
        console.log("Player not found!");
    }
}

function tradeIn(reinforcements) {
    var currentPlayer_index = getPlayerIndexByName(gameData.player_turn);
    /*get name of territory and match to card to get army amount*/
    var hand = gameData.players[currentPlayer_index].hand;

    if (currentPlayer_index !== -1) {
        for (const card in hand) {
            for (var troopType in card) {
                var sets = {}; //sets[troopType];
                if (hand.length >= 3) { // if hand has a possible set
                    hand.forEach(card => { // create a set from matching troopTypes 
                        //console.log(card.troopType);
                        sets[card.troopType] = sets[card.troopType] || [];
                        sets[card.troopType].push(card);
                    });
                    if (sets === undefined) {
                        return sets;
                    } else {
                        // const numSets = Math.floor(hand.length / 3); // possible sets
                        // check if set cards have have troop type
                        for (i = 0; i <= sets.length; i++) {
                            // console.log(sets[i].troopType);
                            if (sets[i].troopType.length == 3 && sets[i].troopType == 'Infantry') { // set reinforments based on set troopType
                                //console.log(reinforcements);
                                reinforcements += 1; // Add reinforcements to player's army
                                //console.log(reinforcements);
                            } else if (sets[i].troopType.length == 3 && sets[i].troopType == 'Cavalry') {
                                //console.log(reinforcements);
                                reinforcements += 5;
                                //console.log(reinforcements);
                            } else if (sets[i].troopType.length == 3 && sets[i].troopType == 'Artillery') {
                                //console.log(reinforcements);
                                reinforcements += 10;
                                //console.log(reinforcements);
                            }
                            // reinforcements += numSets;
                            console.log(`${this.name} traded 3 ${sets[i].troopType} cards for ${reinforcements} troops.`); // ${numSets * 3}
                            removeCardFromArray(sets[i].troopType)
                            return sets;
                        }
                    }
                } else {
                    console.log("No possible sets yet");
                }
            }
        }
    } else {
        console.log("Player not found!");
    }

    // Remove traded cards from player's hand
    // recievedCard().hand = this.cards.filter(card => !tradedCards.includes(card));
}

// This function is called when the current player selects two valid territories and the number of troops to send. This function encapsulates the entire attack.
async function singleAttack() {
    document.getElementById('attackSelectScreen').style.display = 'none';
    document.getElementById('skipButtons').style.display = 'none';
    document.getElementById('skipAttackPhaseButton').style.display = 'none';
    var attackerLostTroops = 0;
    var defenderLostTroops = 0;
    var attackerCurrentTroops = troopsAttackingCount;
    var defenderCurrentTroops = findTerritoryByPolygonId(defender).armies;

    gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(attacker))].armies -= troopsAttackingCount;
    updateInfoBox(findTerritoryByPolygonId(attacker));
    // var attackerBeginningTroops = attackerCurrentTroops;
    // var defenderBeginningTroops = defenderCurrentTroops;
    var randomValue = 0;
    var winner = null;
    var loser = null;
    var bottomBannerText = document.getElementById("bottomBannerText");
    const attackSummaryScreen = document.getElementById('attackSummaryScreen');

    attackLiveScreen.style.maxHeight = '200px';
    attackLiveScreen.style.width = '150px';
    attackLiveScreen.style.overflow = 'scroll';
    attackLiveScreen.innerHTML = `
    <div style="text-align:center;"><span class="popup_screen_text_headers">Live Attack</span></div>
    <hr></hr>
    <div style="text-align:center;"><span class="popup_screen_text">${attacker}:  ${attackerCurrentTroops}</span></div>
    <div style="text-align:center;"><span class="popup_screen_text">${defender}:  ${defenderCurrentTroops}</span></div>
    <hr></hr>
    `;
    attackLiveScreen.style.display = 'block';
    // const attackSummaryScreen = document.getElementById('attackSummaryScreen');
    await sleep(2000);

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

        attackLiveScreen.innerHTML += `
        <div style="text-align:center;"><span class="popup_screen_text">${attacker}:  ${attackerCurrentTroops}</span></div>
        <div style="text-align:center;"><span class="popup_screen_text">${defender}:  ${defenderCurrentTroops}</span></div>
        <hr></hr>
        `
        await sleep(2000);
    }

    await sleep(3000);
    attackLiveScreen.style.display = 'none';

    if (attackerCurrentTroops) {
        winner = attacker;
        loser = defender;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(attacker))].armies = attackerCurrentTroops + findTerritoryByPolygonId(attacker).armies;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].armies = 1;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].owner = findTerritoryByPolygonId(attacker).owner; //
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

        const updatedPlayerCards = recieveCard(gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].name);
        console.log("Updated player's cards:", updatedPlayerCards);
    } else {
        winner = defender;
        loser = attacker;
        // gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(attacker))].armies = 0;
        gameData.territories[gameData.territories.indexOf(findTerritoryByPolygonId(defender))].armies = defenderCurrentTroops;
        attackSummaryScreen.innerHTML = `
        <div>${attacker} lost ${attackerLostTroops} troop(s)</div>
        <div>${defender} lost ${defenderLostTroops} troop(s)</div>
        <div>${loser} beat ${winner}</div>
        <br></br>
        <button onclick="hideAttackSummaryScreen(); displayAttackPhaseContinueOrOverScreen();">Ok</button>
        `;
    }

    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    polygons.forEach(element => {
        // Check if the element has the class you want to remove
        if (element.classList.contains('shimmer')) {
            // If it has the class, remove it
            element.classList.remove('shimmer');
        }
    });
    attackSummaryScreen.style.display = 'block';
}