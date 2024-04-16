// Simulate loading progress
let progress = 0;
const progressBar = document.getElementById('progressBar');
const loadingScreen = document.getElementById('loadingScreen');
const gifContainer = document.getElementById('gifContainer');

function simulateLoading() {
    const interval = setInterval(() => {
        progress += 10; // Increment progress
        progressBar.style.width = progress + '%'; // Update progress bar width
        if (progress >= 100) {
            clearInterval(interval); // Stop the interval when progress reaches 100%
            setTimeout(() => {
                loadingScreen.style.opacity = 0; // Fade out loading screen
                setTimeout(() => {
                    loadingScreen.style.display = 'none'; // Hide loading screen
                }, 500); // After fade out animation
                setTimeout(() => {
                    gifContainer.classList.add('hidden');
                }, 2130); // After fade out animation
            }, 1000); // Wait for 1 second before fading out
        }
    }, 500); // Interval duration
}

// Show the GIF container initially, then start simulating loading
gifContainer.classList.remove('hidden');
setTimeout(() => {
    simulateLoading();
}, 2000); // Show GIF container after 2 seconds

function startGame() {
    var startScreen = document.getElementById("startScreen");
    var gameModeOptions = document.getElementById("gameModeOptions");

    startScreen.style.display = 'none';
    gameModeOptions.style.display = 'flex';
}

/* Get the relevant elements to be displayed in fullscreen mode*/
var gameContainer = document.getElementById("game-container");
var insideGameContainer = document.getElementById('inside-game-container');
var contentWidth = insideGameContainer.style.width;
var contentHeight = insideGameContainer.style.height;

/* The next few functions pertain to the settings page that displays when the local multiplayer game mode is selected. */
function riskLocalMultiplayerGame() {
    var gameModeOptions = document.getElementById("gameModeOptions");
    var riskLocalMultiplayerGameSettings = document.getElementById("riskLocalMultiplayerGameSettings");

    gameModeOptions.style.display = 'none';
    riskLocalMultiplayerGameSettings.style.display = 'flex';
}

var playerCount = 1; // Initial number of total players

function increasePlayer() {
    if (playerCount < 6) {
        if(playerCount + aiCount >= 5 && aiCount > 0) {
            aiCount--;
        }
        playerCount++;
        if(playerCount === 1 && aiCount === 0) {
            aiCount = 1;
        }
        document.getElementById("playerCount").textContent = playerCount;
        document.getElementById("aiCount").textContent = aiCount;
    }
}

function decreasePlayer() {
    if (playerCount > 1) {
        playerCount--;
        if(playerCount === 1 && aiCount === 0) {
            aiCount = 1;
        }
        document.getElementById("playerCount").textContent = playerCount;
        document.getElementById("aiCount").textContent = aiCount;
    }
}

var aiCount = 1; // Initial number of AI opponents

function increaseAI() {
    if (aiCount < 5) {
        if(aiCount + playerCount >= 5 && playerCount > 1) {
            playerCount--;
        }
        aiCount++;
        if(playerCount === 1 && aiCount === 0) {
            aiCount = 1;
        }
        document.getElementById("playerCount").textContent = playerCount;
        document.getElementById("aiCount").textContent = aiCount;
    }
}

function decreaseAI() {
    if (aiCount > 0) {
        aiCount--;
        if(playerCount === 1 && aiCount === 0) {
            aiCount = 1;
        }
        document.getElementById("playerCount").textContent = playerCount;
        document.getElementById("aiCount").textContent = aiCount;
    }
}

// Get the div where player names will be added
var risklocalMultiplayerGameSettingsScreen = document.getElementById("riskLocalMultiplayerGameSettings")
var numberOfPlayersDiv = document.getElementById("riskLocalMultiplayerGameSettingsNumberOfPlayers");
var playersNamesDiv = document.getElementById("riskLocalMultiplayerGameSettingsPlayersNames");
// Variable to store player names
var playerNames = [];

    // Function to generate input field for player names one at a time
    function generatePlayerNameInput(playerIndex) {
    numberOfPlayersDiv.style.display = 'none';
    playersNamesDiv.style.display = 'flex';

    // Clear previous content
    playersNamesDiv.innerHTML = '';

    // Create label for the current player
    var playerNameLabel = document.createElement("label");
    playerNameLabel.textContent = "Enter name for Player " + (playerIndex + 1) + ":";
    playersNamesDiv.appendChild(playerNameLabel);

    // Create input field for the current player
    var playerNameInput = document.createElement("input");
    playerNameInput.type = "text";
    playerNameInput.placeholder = "Enter name";
    playerNameInput.id = "playerNameInput";
    playersNamesDiv.appendChild(playerNameInput);

    // Create button to submit the name
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.onclick = function() {
        // Get the value entered by the user
        var playerName = playerNameInput.value;
        // Add the name to the array
        playerNames.push(playerName);
        // If there are more players, generate input field for the next player
        if (playerIndex < playerCount - 1) {
            generatePlayerNameInput(playerIndex + 1);
        } else {
            // If all players have entered their names, do something (e.g., start the game)
            console.log("All player names submitted:", playerNames);
            playersNamesDiv.style.display = 'none';
            risklocalMultiplayerGameSettingsScreen.style.display = 'none';
            newRiskLocalGame();
        }
    };
    playersNamesDiv.appendChild(submitButton);
}

async function newRiskLocalGame() {
    if(aiCount > 0) {
        for(i = 1; i <= aiCount; i++) {
            playerNames.push("Computer" + "(" + i  + ")");
        }
    }

    const userData = await getData();
    console.log(userData);
    if(userData) {
        const gameInfo = {
            playerNames,
            gameMode: 'Local'
        };
        try {
            const response = await fetch('/insert-riskLocalGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData._id,
                    gameInfo: gameInfo
                })
            });

            if (!response.ok) {
                throw new Error('Failed to insert risk local game');
            }

            const data = await response.json();
            console.log('Local risk game inserted successfully');
            console.log('Starting local risk game...');
            playLocalRiskGame();
        } catch (error) {
        console.error('Error inserting local risk game:', error);
        }
    }
}

// Originally I had two functions: startRiskLocalGame() and resumeRiskLocalGame(), I decided to combine them and 
// generalize them for simplification purposes. Anyway, this function gets the userData to then get the game info.
async function playLocalRiskGame() {
    const userData = await getData();
    const gameData = await getLocalRiskGameData(userData._id);
    console.log("Local risk game data: ", gameData._id, "  ", gameData.playerNames);
    updateTerritoryColors(gameData);
}

function updateTerritoryColors(gameData) {
    const colorsFill = ["#cce5ff", "#d8e9b6", "#f0d6e1", "#fad8be", "#85c1ff"];
    const colorsStroke = ["#0066cc", "#4d9900", "#cc0066", "#ff6633", "#99cc00", "#0077cc"];
    const polygons = document.getElementById("riskSVGMap").contentWindow.document.getElementsByTagName("polygon");
    const polygonIds = [];

    for(i = 0; i < polygons.length; i++) {
        const polygonId = polygons[i].getAttribute("id");
        polygonIds.push(polygonId);
    }

    gameData.territories.forEach((territory) => {
        for(i = 0; i < gameData.territories.length; i++) {
            if(territory.name === polygonIds[i]) {
                const country = document.getElementById("riskSVGMap").contentWindow.document.getElementById(polygonIds[i]);
                console.log(country);
                if(country) {
                    country.style.fill = colorsFill[gameData.playerNames.indexOf(territory.owner)];
                    country.style.stroke = colorsStroke[gameData.playerNames.indexOf(territory.owner)];
                }
            }
        }
    });

    // const countries = Array.from(document.querySelectorAll('polygon'));
    // console.log("Territory data:", gameData.territories);
    // console.log("Polygon data: ", countries);
    // countries.forEach((country) => {
    //     const territory = gameData.territories.find((t) => t.name === country.id);
    //     console.log("CountryID: ", country.id);
    //     console.log("Territory: ", territory);

    //     if(territory) {
    //         console.log("Territory Name: ", territory.name);
    //         console.log("Territory Owner: ", territory.owner);
    //         const index =  gameData.playerNames.indexOf(territory.owner);
    //         console.log("Index: ", index);
    //         document.getElementById(country.id).style.fill = colorsFill[index];
    //         document.getElementById(country.id).style.stroke = colorsStroke[index];
    //     }
    // });
}

async function getLocalRiskGameData(userId) {
    try {
        // Fetch user data using token
        const response = await fetch('/riskLocalGame-data', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userId}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch game data');
        }

        // Parse response data
        const data = await response.json();
        return data;
    } catch (error) {
        // Log error if fetching game data fails
        console.error('Error with game:', error);
        throw error;
    }
}

/* This functions main goal is to call the reqeustFullscreen() method. The rest of the code in the function 
is just making sure the content in the full screen mode is scaled and placed properly. */
function openFullscreen() {
    if (gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen();

        // Calculate the scaling factor based on the screen width. This is just to make sure the full screen mode fits most screens.
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        var minScalingFactor = 0.8; // Adjust as needed
        var maxScalingFactor = 0.9; // Adjust as needed

        // Calculate the scaling factor based on the screen width
        var scalingFactor = Math.max(2, screenWidth / 800); // This is based off of my laptop screen as a reference hence the seemingly arbitrary numbers.
        
        // Set the width and height of the insideGameContainer based on the scaling factor
        if(scalingFactor === 2) {
            insideGameContainer.style.width = screenWidth * maxScalingFactor + "px";
            insideGameContainer.style.height = screenHeight + "px";
        }
        else {
            insideGameContainer.style.width = screenWidth * minScalingFactor + "px";
            insideGameContainer.style.height = screenHeight + "px";
        }
        gameContainer.style.justifyContent = 'center';
        gameContainer.style.alignItems = 'center';
        gameContainer.style.display = 'flex';
    } 
}

document.addEventListener('fullscreenchange', exitFullscreenHandler);

function exitFullscreenHandler() {
    if (!document.fullscreenElement) {
        // If the fullscreenElement is null, it means the user has exited fullscreen mode
        insideGameContainer.style.width = contentWidth; // Reset width to default
        insideGameContainer.style.height = contentHeight; // Reset height to default
        gameContainer.style.justifyContent = ''; // Reset justifyContent
        gameContainer.style.alignItems = ''; // Reset alignItems
        gameContainer.style.display = ''; // Reset display
        gameContainer.style.transform = ''; // Reset transform (scaling)
    }
}