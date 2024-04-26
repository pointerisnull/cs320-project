const socket = new WebSocket('ws://localhost:3000');

async function createServer() {
    const serverName = document.getElementById('serverNameInput').value;
    const hostUserData = await getData();
    console.log(hostUserData._id);
    const serverData = { action: 'createServer', serverName: serverName, host: hostUserData._id, playerIds: [hostUserData._id]};
    socket.send(JSON.stringify(serverData));
}

// Function to request the list of servers from the server
async function getRiskServers() {
    socket.send(JSON.stringify({ action: 'getServers' }));
}

socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    if (message.action === 'serverCreated') {
        // Handle server created confirmation
        console.log('Server created successfully');
    } else if (message.action === 'serverList') {
        // Handle list of servers received from the server
        const serverList = message.servers;
        console.log('Received server list:', serverList);
        // Display the list of servers to the user
        displayServers(serverList); // Implement this function to display servers on the UI
    } else if (message.action === 'joinServer') {
        console.log("Joined server");
        getRiskServers();
    } else if (message.action === 'error') {
        // Handle error message
        console.error('Error:', message.error);
    }
};


function displayServers(serverList) {
    const gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    const riskOnlineGameServerScreen = document.getElementById("riskOnlineGameServerScreen");
    const listRiskServerScreen = document.getElementById("listRiskServerScreen");
    gameModeOptionsScreen.style.display = 'none';
    riskOnlineGameServerScreen.style.display = 'block';

    // Clear the existing content
    listRiskServerScreen.innerHTML = '';

    // Display the number of servers
    const riskServerCount = document.createElement('h1');
    riskServerCount.textContent = `Number of servers: ${serverList.length}`;
    listRiskServerScreen.appendChild(riskServerCount);

    // Add a line break
    listRiskServerScreen.appendChild(document.createElement('br'));

    // Loop through the serverList array and create HTML elements for each server
    serverList.forEach(server => {
        const serverDiv = document.createElement('div');
        serverDiv.textContent = "Server Name: " + server.serverName + "\n" + "Number of Players: " + server.playerIds.length; // Modify this to display other server details as needed

        // Attach an event listener to join the server when clicked
        serverDiv.addEventListener('click', () => {
            joinServer(server); // Pass the server ID to the joinServer function
        });

        listRiskServerScreen.appendChild(serverDiv);
    });
}

async function joinServer(serverData) {
    const newPlayerId = (await getData())._id;
    
    // Check if the player's ID is already in the list of player IDs for the selected server
    if (!serverData.playerIds.includes(newPlayerId)) {
        // If the player's ID is not already in the list, proceed to join the server
        serverData.playerIds.push(newPlayerId);
        socket.send(JSON.stringify({ action: 'joinServer', server: serverData }));
    } else {
        // If the player's ID is already in the list, display a message indicating that the player cannot join
        console.log('Cannot join server: Player is already in the server.');
    }
}

function toggleCreateServerScreen() {
    const createServerScreen = document.getElementById("createRiskServerScreen");
    if (createServerScreen.style.display === "none") {
        createServerScreen.style.display = "block";
    } else {
        createServerScreen.style.display = "none";
    }
}

// This function is called when the "Play Game" button is pushed on the start screen.
async function selectGameModeScreen() {
    var startScreen = document.getElementById("startScreen");
    var gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");

    startScreen.style.display = 'none';
    gameModeOptionsScreen.style.display = 'flex';

    // This part of the function is just checking if a game is currently saved to the database under the user's id, if so, a button will be displayed to resume that specific game.
    const userData = await getData();
    checkGameData = await getLocalRiskGameData(userData._id);

    if(checkGameData) {
        if(checkGameData.game_mode === 'Local') {
            const resumeLocalRiskGameButton = document.getElementById("resumeLocalRiskGameButton");
            resumeLocalRiskGameButton.textContent = "Resume Game";
            resumeLocalRiskGameButton.style.display = 'block';
        }
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

    gameModeOptionsScreen.style.display = 'none';
    riskLocalMultiplayerGameSettingsScreen.style.display = 'flex';
}

function riskOnlineGame() {
    var gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    var riskOnlineGameServerScreen = document.getElementById("riskOnlineGameServerScreen");

    

    gameModeOptionsScreen.style.display = 'none';
    riskOnlineGameServerScreen.style.display = 'flex';
}

var playerCount = 1; // Initial number of total players

function increasePlayer() {
    if (playerCount < 6) {
        if(playerCount + aiCount >= 6 && aiCount > 0) {
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
        if(aiCount + playerCount >= 6 && playerCount > 1) {
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
var risklocalMultiplayerGameSettingsScreen = document.getElementById("riskLocalMultiplayerGameSettingsScreen")
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
            // If all players have entered their names, this block of code is ran which will involve a call to the newRiskLocalGame() function.
            console.log("All player names submitted:", playerNames);
            playersNamesDiv.style.display = 'none';
            risklocalMultiplayerGameSettingsScreen.style.display = 'none';
            newRiskLocalGame();
        }
    };
    playersNamesDiv.appendChild(submitButton);
}

// This function takes all the game info listed out above (i.e., number of players, number of ai, etc.) and uses a post request to send it server-side, 
// which it will then be sent as a parameter to the RiskInsert.js file and then used to create a new document in the Risk collection in our database.
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

// Is called when the button in the game mode selection screen is pressed. All it does is it removes said screen and calls the playLocalRiskGame() function to start the game.
function resumeLocalRiskGame() {
    var gameModeOptionsScreen = document.getElementById("gameModeOptionsScreen");
    gameModeOptionsScreen.style.display = 'none';
    playLocalRiskGame();
}

var gameData = null;

// Originally I had two functions: startRiskLocalGame() and resumeRiskLocalGame(), I decided to combine them and 
// generalize them for simplification purposes. Anyway, this function gets the userData to then get the game data 
// and calls the neccessary starting functions to setup the game screen.
async function playLocalRiskGame() {
    const userData = await getData();
    gameData = await getLocalRiskGameData(userData._id);
    if(gameData) {
        console.log(gameData);
        nextTurn();
    }
}

// This function is used to fetch the game data of a local game of risk from the database using a get request to the server.
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

async function updateLocalRiskGameData() {
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