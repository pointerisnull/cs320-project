// This function is called when the next turn is ready to be played. It does this by setting off a chain of function calls, starting with the reinforcementPhase() function.
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

// This function encompasses the entire attack phase. It updates the banner (I will finish the comment when I finish this function)...
function attackPhase(gameData) {
    console.log("Attack phase starting...")
    gameData.game_phase = 'attack';
    updateBanner(gameData);

    const polygons = document.getElementById("riskSVGMap").contentDocument.getElementsByTagName("polygon");
    Array.from(polygons).forEach(polygon => {
        polygon.addEventListener('click', (event) => handlePolygonClick(event, gameData));
    });


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