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
        }
    });

    if(bestPair) {
        bottomBannerText.innerHTML = "Computer player has decided to attack " + bestPair.defender.name + " with " + bestPair.attacker.name;
        await sleep(5000);
        computerSingleAttack(bestPair);
    }
}

function computerSingleAttack(attackingSet) {
    var attackerLostTroops = 0;
    var defenderLostTroops = 0;
    var attackerCurrentTroops = attackingSet.attacker.armies;
    var defenderCurrentTroops = attackingSet.defender.armies;
    // var attackerBeginningTroops = attackerCurrentTroops;
    // var defenderBeginningTroops = defenderCurrentTroops;
    var randomValue = 0;
    var winner = null;
    var loser = null;
    var bottomBannerText = document.getElementById("bottomBannerText");
    // const attackSummaryScreen = document.getElementById('attackSummaryScreen');

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
        sleep(500);
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
}