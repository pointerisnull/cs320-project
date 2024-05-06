const sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};

async function computerReinforcementPhase() {
    console.log("Computer reinforcement phase starting...");
    gameData.game_phase = 'reinforcement';

    // Determine the number of reinforcements for the computer player
    var numberOfReinforcements = reinforcementsEarned();
    const topBannerText = document.getElementById('topBannerText');
    const bottomBannerText = document.getElementById('bottomBannerText');
    bottomBannerText.innerHTML = "Computer player thinking...";
    gameData.reinforcements = numberOfReinforcements;
    topBannerText.innerHTML += " | You have " + gameData.reinforcements + " troops to place";
    await sleep(2000);

    // Perform actions based on the number of reinforcements
    let remainingReinforcements = gameData.reinforcements;
    console.log("Remaining reinforcements:", remainingReinforcements);

    // Prioritize reinforcing territories with fewer armies
    for (const territory of gameData.territories.filter(territory => territory.owner === gameData.player_turn && remainingReinforcements > 0 && territory.armies <= 1)) {
        if (remainingReinforcements > 0) {
            territory.armies++;
            remainingReinforcements--;
            updateComputerReinforcementPhase(remainingReinforcements, territory);
            await sleep(2000);
        }
    }

    // If there are still reinforcements remaining, reinforce territories with up to 3 armies
    for (const territory of gameData.territories.filter(territory => territory.owner === gameData.player_turn && remainingReinforcements > 0 && territory.armies <= 3)) {
        if (remainingReinforcements > 0) {
            territory.armies++;
            remainingReinforcements--;
            updateComputerReinforcementPhase(remainingReinforcements, territory);
            await sleep(2000);
        }
    }

    // If there are still reinforcements remaining, reinforce any territory
    for (const territory of gameData.territories.filter(territory => territory.owner === gameData.player_turn && remainingReinforcements > 0)) {
        if (remainingReinforcements > 0) {
            territory.armies++;
            remainingReinforcements--;
            updateComputerReinforcementPhase(remainingReinforcements, territory);
            await sleep(2000);
        }
    }

    // Update the game data with the remaining reinforcements
    gameData.reinforcements = remainingReinforcements;
    if(!gameData.reinforcements) {
        computerAttackPhase();
    }
}

function updateComputerReinforcementPhase(reinforcements, territory) {
    const topBannerText = document.getElementById('topBannerText');
    const bottomBannerText = document.getElementById('bottomBannerText');
    updateTopBanner();
    topBannerText.innerHTML += " | You have " + reinforcements + " troops to place";
    bottomBannerText.innerHTML = gameData.player_turn + " reinforced " + territory.name + " with one troop.";
}

async function computerAttackPhase() {
    console.log("Attack phase starting...")
    gameData.game_phase = 'attack';
    var bottomBannerText = document.getElementById("bottomBannerText");
    updateTopBanner();
    bottomBannerText.innerHTML = "Computer player thinking..."
    await sleep(2000);

    var possibleTerritoriesToAttack = []; //2D array where 1st entry in every array is owned territory and 2nd entry is possible target.
    var largestArmyDifferential = 0;
    var bestPair = null;

    const polygons = document.getElementById("riskSVGMap").contentDocument.querySelectorAll("polygon");
    
    gameData.territories.forEach((territory) => {
        if(territory.owner === gameData.player_turn && territory.armies > 1) {
            polygons.forEach((polygon) => {
                if(isAdjacent(territory.name, polygon.id) && findTerritoryByPolygonId(polygon.id).owner !== territory.owner) {
                    possibleTerritoriesToAttack.push({attacker: territory, defender: findTerritoryByPolygonId(polygon.id)});
                }
            });
        }
    });

    possibleTerritoriesToAttack.forEach((pair) => {
        console.log(pair);
        if(pair.attacker.armies - pair.defender.armies > largestArmyDifferential) {
            bestPair = pair;
            largestArmyDifferential = pair.attacker.armies - pair.defender.armies;
        }
    });

    if(bestPair) {
        bottomBannerText.innerHTML = "Computer player has decided to attack " + bestPair.defender.name + " with " + bestPair.attacker.name;
        await sleep(3000);
        computerSingleAttack(bestPair);
    }
}

async function computerSingleAttack(attackingSet) {
    var attackerLostTroops = 0;
    var defenderLostTroops = 0;
    var attackerCurrentTroops = attackingSet.attacker.armies;
    var defenderCurrentTroops = attackingSet.defender.armies;
    // var attackerBeginningTroops = attackerCurrentTroops;
    // var defenderBeginningTroops = defenderCurrentTroops;
    var randomValue = 0;
    var winner = null;
    var loser = null;
    const bottomBannerText = document.getElementById("bottomBannerText");
    const attackLiveScreen = document.getElementById("attackLiveScreen");
    attackLiveScreen.style.maxHeight = '200px';
    attackLiveScreen.style.width = '150px';
    attackLiveScreen.style.overflow = 'scroll';
    attackLiveScreen.innerHTML = `
    <div style="text-align:center;"><span class="popup_screen_text_headers">Live Attack</span></div>
    <hr></hr>
    <div style="text-align:center;"><span class="popup_screen_text">${attackingSet.attacker.name}:  ${attackerCurrentTroops}</span></div>
    <div style="text-align:center;"><span class="popup_screen_text">${attackingSet.defender.name}:  ${defenderCurrentTroops}</span></div>
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
        console.log(attackingSet.attacker.name, ": ", attackerCurrentTroops);
        console.log(attackingSet.defender.name, ": ", defenderCurrentTroops);
        attackLiveScreen.innerHTML += `
        <div style="text-align:center;"><span class="popup_screen_text">${attackingSet.attacker.name}:  ${attackerCurrentTroops}</span></div>
        <div style="text-align:center;"><span class="popup_screen_text">${attackingSet.defender.name}:  ${defenderCurrentTroops}</span></div>
        <hr></hr>
        `;
        await sleep(2000);
    }

    if (attackerCurrentTroops) {
        winner = attackingSet.attacker.name;
        loser = attackingSet.defender.name;
        gameData.territories[gameData.territories.indexOf(attackingSet.attacker)].armies = attackerCurrentTroops;
        gameData.territories[gameData.territories.indexOf(attackingSet.defender)].armies = defenderCurrentTroops + 1;
        gameData.territories[gameData.territories.indexOf(attackingSet.defender)].owner = attackingSet.attacker.owner;
        updateTerritoryColors();
        bottomBannerText.innerHTML = gameData.player_turn + " successfully invaded " + loser + "!";
    }
    else {
        winner = attackingSet.defender.name;
        loser = attackingSet.attacker.name;
        gameData.territories[gameData.territories.indexOf(attackingSet.attacker)].armies = attackerCurrentTroops + 1;
        gameData.territories[gameData.territories.indexOf(attackingSet.defender)].armies = defenderCurrentTroops;
        bottomBannerText.innerHTML = gameData.player_turn + " failed to invade " + loser + "!";
    }

    await sleep(3000);
    attackLiveScreen.style.display = 'none';

    computerFortifyPhase();
}

async function computerFortifyPhase() {
    console.log("Fortify phase starting...")
    gameData.game_phase = 'fortify';
    var bottomBannerText = document.getElementById("bottomBannerText");
    updateTopBanner();
    bottomBannerText.innerHTML = "Computer player thinking..."
    await sleep(2000);

    var possibleTerritoriesToFortify = [];
    var largestArmyDifferential = 0;
    var bestPair = null;
    // Prioritize fortifying territories with fewer armies. The first forEach loop is looking for territories 
    // that will send troops and the second forEach loop is looking for territories that will receive troops.
    gameData.territories.forEach((territory) => {
        if(territory.owner === gameData.player_turn && territory.armies > 1) {
            gameData.territories.forEach((adjacentTerritory) => {
                if(isAdjacent(territory.name, adjacentTerritory.name) && adjacentTerritory.owner === gameData.player_turn) {
                    possibleTerritoriesToFortify.push({sender: territory, receiver: adjacentTerritory});
                }
            });
        }
    });

    possibleTerritoriesToFortify.forEach((pair) => {
        console.log(pair);
        if(pair.sender.armies - pair.receiver.armies > largestArmyDifferential) {
            bestPair = pair;
            largestArmyDifferential = pair.sender.armies - pair.receiver.armies;
        }
    });

    if(bestPair) {
        bottomBannerText.innerHTML = "Computer player has decided to fortify " + bestPair.receiver.name + " with " + bestPair.sender.name;
        await sleep(3000);
        computerSingleFortify(bestPair);
    }
}

// Very very simple. If we had more time I would make the decision processes more logical.
async function computerSingleFortify(fortifyingSet) {
    if(fortifyingSet.sender.armies <= 3) {
        gameData.territories[gameData.territories.indexOf(fortifyingSet.sender)].armies -= 1;
        gameData.territories[gameData.territories.indexOf(fortifyingSet.receiver)].armies += 1;
    }
    else if(fortifyingSet.sender.armies <= 8){
        gameData.territories[gameData.territories.indexOf(fortifyingSet.sender)].armies -= 2;
        gameData.territories[gameData.territories.indexOf(fortifyingSet.receiver)].armies += 2;
    }
    else {
        gameData.territories[gameData.territories.indexOf(fortifyingSet.sender)].armies -= 4;
        gameData.territories[gameData.territories.indexOf(fortifyingSet.receiver)].armies += 4;
    }
    var bottomBannerText = document.getElementById("bottomBannerText");
    bottomBannerText.innerHTML = gameData.player_turn + "'s turn is over...";
    await sleep(2000);
    endCurrentTurn();
}