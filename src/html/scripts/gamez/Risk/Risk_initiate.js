function backToRiskHomeScreen() {
    const startScreen = document.getElementById("startScreen");
    const gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    const riskLocalMultiplayerGameSettingsScreen = document.getElementById("riskLocalMultiplayerGameSettingsScreen");
    const riskComputerSettingsScreen = document.getElementById("riskComputerSettingsScreen");
    const riskOnlineGameScreen = document.getElementById("riskOnlineGameScreen");
    const numberOfPlayersDiv = document.getElementById("riskLocalMultiplayerGameSettingsNumberOfPlayers");
    const playersNamesDiv = document.getElementById("riskLocalMultiplayerGameSettingsPlayersNames");

    gameModeOptionsScreen.style.display = 'none';
    riskLocalMultiplayerGameSettingsScreen.style.display = 'none';
    riskComputerSettingsScreen.style.display = 'none';
    riskOnlineGameScreen.style.display = 'none';
    numberOfPlayersDiv.style.display = 'none';
    playersNamesDiv.style.display = 'none';
    startScreen.style.display = 'flex';
}

// This function is called when the "Play Game" button is pushed on the start screen.
async function selectGameModeScreen() {
    var startScreen = document.getElementById("startScreen");
    var gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");


    startScreen.style.display = 'none';
    gameModeOptionsScreen.style.display = 'flex';

    // This part of the function is just checking if a game is currently saved to the database under the user's id, if so, a button will be displayed to resume that specific game.
    const userData = await getData();
    checkGameData = await getRiskGameData(userData._id);
    if(checkGameData) {
        const resumeRiskGameButton = document.getElementById("resumeRiskGameButton");
        resumeRiskGameButton.textContent = "Resume Game";
        resumeRiskGameButton.style.display = 'block';
    }
}

/* Get the relevant elements to be displayed in fullscreen mode*/
var gameContainer = document.getElementById("game-container");
var insideGameContainer = document.getElementById('inside-game-container');
var contentWidth = insideGameContainer.style.width;
var contentHeight = insideGameContainer.style.height;

/* The next few functions pertain to the settings page that displays when the local multiplayer game mode is selected. */
function riskLocalMultiplayerGame() {
    var gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    var riskLocalMultiplayerGameSettingsScreen = document.getElementById("riskLocalMultiplayerGameSettingsScreen");
    const numberOfPlayersDiv = document.getElementById("riskLocalMultiplayerGameSettingsNumberOfPlayers");

    gameModeOptionsScreen.style.display = 'none';
    riskLocalMultiplayerGameSettingsScreen.style.display = 'flex';
    numberOfPlayersDiv.style.display = 'flex';
}

function riskComputerGame() {
    var gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    var riskComputerSettingsScreen = document.getElementById("riskComputerSettingsScreen");

    gameModeOptionsScreen.style.display = 'none';
    riskComputerSettingsScreen.style.display = 'flex';
}

function riskComputerGame() {
    var gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    var riskComputerSettingsScreen = document.getElementById("riskComputerSettingsScreen");

    gameModeOptionsScreen.style.display = 'none';
    riskComputerSettingsScreen.style.display = 'flex';
}

function riskOnlineGame() {
    const gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    const riskOnlineGameScreen = document.getElementById("riskOnlineGameScreen");

    gameModeOptionsScreen.style.display = 'none';
    riskOnlineGameScreen.style.display = 'flex';
}

var playerCount = 1; // Initial number of total players

function increasePlayer() {
    if (playerCount < 6) {
        if(playerCount + aiCountLocal >= 6 && aiCountLocal > 0) {
            aiCountLocal--;
        }
        playerCount++;
        if(playerCount === 1 && aiCountLocal === 0) {
            aiCountLocal = 1;
        }
        document.getElementById("playerCount").textContent = playerCount;
        document.getElementById("aiCountLocal").textContent = aiCountLocal;
    }
}

function decreasePlayer() {
    if (playerCount > 1) {
        playerCount--;
        if(playerCount === 1 && aiCountLocal === 0) {
            aiCountLocal = 1;
        }
        document.getElementById("playerCount").textContent = playerCount;
        document.getElementById("aiCountLocal").textContent = aiCountLocal;
    }
}

var aiCountLocal = 1;
var aiCountComputer = 1; // Initial number of AI opponents

function increaseAI(mode) {
    if(mode === 'Local') {
        if (aiCountLocal < 5) {
            if(aiCountLocal + playerCount >= 6 && playerCount > 1) {
                playerCount--;
            }
            aiCountLocal++;
            if(playerCount === 1 && aiCountLocal === 0) {
                aiCountLocal = 1;
            }
        }
    }
    else if(mode === 'Computer') {
        if (aiCountComputer < 5) {
            if(aiCountComputer + playerCount >= 6 && playerCount > 1) {
                playerCount--;
            }
            aiCountComputer++;
            if(playerCount === 1 && aiCountComputer === 0) {
                aiCountComputer = 1;
            }
        }
    }
    document.getElementById("playerCount").textContent = playerCount;
    document.getElementById("aiCountLocal").textContent = aiCountLocal;
    document.getElementById("aiCountComputer").textContent = aiCountComputer;
}

function decreaseAI(mode) {
    if(mode === 'Local') {
        if (aiCountLocal > 0) {
            aiCountLocal--;
            if(playerCount === 1 && aiCountLocal === 0) {
                aiCountLocal = 1;
            }
        }
    }
    else if(mode === 'Computer') {
        if (aiCountComputer > 1) {
            aiCountComputer--;
            if(playerCount === 1 && aiCountComputer === 0) {
                aiCountComputer = 1;
            }
        }
    }
    document.getElementById("playerCount").textContent = playerCount;
    document.getElementById("aiCountLocal").textContent = aiCountLocal;
    document.getElementById("aiCountComputer").textContent = aiCountComputer;
}

// Get the div where player names will be added
var risklocalMultiplayerGameSettingsScreen = document.getElementById("riskLocalMultiplayerGameSettingsScreen");
var numberOfPlayersDiv = document.getElementById("riskLocalMultiplayerGameSettingsNumberOfPlayers");
var playersNamesDiv = document.getElementById("riskLocalMultiplayerGameSettingsPlayersNames");
// Variables to store player data
var players = [/*{ name: null, reinforcements: 3, hand: [] }*/]; // object w/ player name, hand for cards recieved & reinforcments for each player
var playerNames = null;

// Function to generate input field for player names one at a time
function generatePlayerNameInput(playerIndex) {
    numberOfPlayersDiv.style.display = 'none';
    playersNamesDiv.style.display = 'flex';

    // Clear previous content
    playersNamesDiv.innerHTML = '';

    // Create label for the current player
    var playerNameLabel = document.createElement("label");
    playerNameLabel.textContent = "Enter name for Player " + (playerIndex + 1) + ":";
    playerNameLabel.id = "playerNameLabel";
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
    submitButton.onclick = function () {
        // Get the value entered by the user
        var playerName = playerNameInput.value;
        // Add the name to the array
        players.push({ name: playerName, reinforcements: 0, hand: [] });

        // If there are more players, generate input field for the next player
        if (playerIndex < playerCount - 1) {
            generatePlayerNameInput(playerIndex + 1);
        } else {
            // If all players have entered their names, this block of code is ran which will involve a call to the newRiskGame() function.
            console.log("All player names submitted:", playerNames);
            playersNamesDiv.style.display = 'none';
            risklocalMultiplayerGameSettingsScreen.style.display = 'none';
            const mode = 'Local';
            newRiskGame(mode);
        }
    };
    playersNamesDiv.appendChild(submitButton);
}

// This function takes all the game info listed out above (i.e., number of players, number of ai, etc.) and uses a post request to send it server-side, 
// which it will then be sent as a parameter to the RiskInsert.js file and then used to create a new document in the Risk collection in our database.
async function newRiskGame(mode) {

    const riskComputerSettingsScreen = document.getElementById("riskComputerSettingsScreen");

    const userData = await getData();
    console.log(userData);

    if(mode === 'Computer') {
        playerNames.push(userData.user_name);
        riskComputerSettingsScreen.style.display = 'none';

        if(aiCountComputer > 0) {
            for(i = 1; i <= aiCountComputer; i++) {
                players.push({ name: "Computer" + "(" + i + ")", reinforcements: 3, hand: [] });
            }
        }
    }

    if(mode === 'Local') {
        if(aiCountLocal > 0) {
            for(i = 1; i <= aiCountLocal; i++) {
                players.push({ name: "Computer" + "(" + i + ")", reinforcements: 3, hand: [] });
            }
        }
    }

    function getName() {
        const names = [];
        for (let player of players) {
            names.push(player.name);
        }
        return names;
    }

    playerNames = new getName();

    if(userData) {
        const gameInfo = {
            players,
            playerNames,
            gameMode: mode
        };
        try {
            const response = await fetch('/insert-riskLocalGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userData: userData,
                    gameInfo: gameInfo
                })
            });

            if (!response.ok) {
                throw new Error('Failed to insert risk game');
            }

            const data = await response.json();
            console.log('Risk game inserted successfully');
            console.log('Starting risk game...');
            playRiskGame();
        } catch (error) {
            console.error('Error inserting risk game:', error);
        }
    }
}

// Is called when the button in the game mode selection screen is pressed. All it does is it removes said screen and calls the playLocalRiskGame() function to start the game.
function resumeRiskGame() {
    var gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    gameModeOptionsScreen.style.display = 'none';
    playRiskGame();
}

var gameData = null;

// Originally I had two functions: startRiskLocalGame() and resumeRiskLocalGame(), I decided to combine them and 
// generalize them for simplification purposes. Anyway, this function gets the userData to then get the game data 
// and calls the neccessary starting functions to setup the game screen.
async function playRiskGame() {
    const userData = await getData();
    gameData = await getRiskGameData(userData._id);
    fetchBalanceAndAvatar();
    if(gameData) {
        console.log(gameData);
        nextTurn();
    }
}

// This function is used to fetch the game data of a local game of risk from the database using a get request to the server.
async function getRiskGameData(userId) {
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

async function updateRiskGameData() {
    try {
        const response = await fetch('/updateRiskLocalGame-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                gameData
            )
        });

        if (!response.ok) {
            throw new Error('Failed to update local risk game data');
        }

        const data = await response.json();
        console.log('Local risk game data updated successfully.');
        return true;
    } catch (error) {
        console.error('Error updating local risk game data', error);
    }
}
