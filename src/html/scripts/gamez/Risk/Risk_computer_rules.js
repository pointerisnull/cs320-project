const sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};

async function computerReinforcementPhase() {
    console.log("Computer reinforcement phase starting...");

    // Determine the number of reinforcements for the computer player
    var numberOfReinforcements = reinforcementsEarned();
    const topBannerText = document.getElementById('topBannerText');
    const bottomBannerText = document.getElementById('bottomBannerText');
    bottomBannerText.innerHTML = "Computer Player thinking...";
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
}

function updateComputerReinforcementPhase(reinforcements, territory) {
    const topBannerText = document.getElementById('topBannerText');
    const bottomBannerText = document.getElementById('bottomBannerText');
    updateTopBanner();
    topBannerText.innerHTML += " | You have " + reinforcements + " troops to place";
    bottomBannerText.innerHTML = gameData.player_turn + " reinforced " + territory.name + " with one troop.";
}