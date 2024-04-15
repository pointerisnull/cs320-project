const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to shuffle an array (mainly used for the territories field)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Risk Cards w/ trade in rules coming soon

// Function to create a new Risk game
async function createRiskGame(userId, gameInfo) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Create a new Risk game object
    const db = client.db();

    // Define the game board and initial state
    const gameBoard = {
      // Territories to be shuffled and assigned
      territories: [
        { name: 'Alaska', owner: null, armies: 3 },
        { name: 'North West Territory', owner: null, armies: 2 },
        { name: 'Alberta', owner: null, armies: 3 },
        { name: 'Ontario', owner: null, armies: 2 },
        { name: 'Quebec', owner: null, armies: 3 },
        { name: 'Greenland', owner: null, armies: 2 },
        { name: 'Western United States', owner: null, armies: 3 },
        { name: 'Eastern United States', owner: null, armies: 2 },
        { name: 'Central America', owner: null, armies: 3 },
        { name: 'Venezuela', owner: null, armies: 2 },
        { name: 'Brazil', owner: null, armies: 3 },
        { name: 'Peru', owner: null, armies: 2 },
        { name: 'Argentina', owner: null, armies: 3 },
        { name: 'Iceland', owner: null, armies: 2 },
        { name: 'Great Britain', owner: null, armies: 3 },
        { name: 'Western Europe', owner: null, armies: 2 },
        { name: 'Southern Europe', owner: null, armies: 3 },
        { name: 'Northern Europe', owner: null, armies: 2 },
        { name: 'Scandinavia', owner: null, armies: 3 },
        { name: 'Ukraine', owner: null, armies: 2 },
        { name: 'Ural', owner: null, armies: 3 },
        { name: 'Serbia', owner: null, armies: 2 },
        { name: 'Yakutsk', owner: null, armies: 3 },
        { name: 'Kamchatka', owner: null, armies: 2 },
        { name: 'Irkutsk', owner: null, armies: 3 },
        { name: 'Mongolia', owner: null, armies: 2 },
        { name: 'Afghanistan', owner: null, armies: 3 },
        { name: 'China', owner: null, armies: 2 },
        { name: 'India', owner: null, armies: 3 },
        { name: 'Slam', owner: null, armies: 2 },
        { name: 'Japan', owner: null, armies: 3 },
        { name: 'Middle East', owner: null, armies: 2 },
        { name: 'Egypt', owner: null, armies: 2 },
        { name: 'East Africa', owner: null, armies: 3 },
        { name: 'Congo', owner: null, armies: 2 },
        { name: 'South Africa', owner: null, armies: 3 },
        { name: 'North Africa', owner: null, armies: 2 },
        { name: 'Madagascar', owner: null, armies: 3 },
        { name: 'Indonesia', owner: null, armies: 2 },
        { name: 'New Guinea', owner: null, armies: 3 },
        { name: 'Western Australia', owner: null, armies: 2 },
        { name: 'Eastern Australia', owner: null, armies: 2 }
      ],
      connections: [// coming soon
      ],
      ownership: { // set randomly during initialization
        'Alaska': players,
        'North West Territory': players,
        'Alberta': players,
        'Ontario': players,
        'Quebec': players,
        'Greenland': players,
        'Western United States': players,
        'Eastern United States': players,
        'Central America': players,
        'Venezuela': players,
        'Brazil': players,
        'Peru': players,
        'Argentina': players,
        'Iceland': players,
        'Great Britain': players,
        'Western Europe': players,
        'Southern Europe': players,
        'Northern Europe': players,
        'Scandinavia': players,
        'Ukraine': players,
        'Ural': players,
        'Serbia': players,
        'Yakutsk': players,
        'Kamchatka': players,
        'Irkutsk': players,
        'Mongolia': players,
        'Afghanistan': players,
        'China': players,
        'India': players,
        'Slam': players,
        'Japan': players,
        'Middle East': players,
        'Egypt': players,
        'East Africa': players,
        'Congo': players,
        'South Africa': players,
        'North Africa': players,
        'Madagascar': players,
        'Indonesia': players,
        'New Guinea': players,
        'Western Australia': players,
        'Eastern Australia': players
      }, // Map territory to player
      troops: { // // Map territory to # of troops; randomly set when initializing game
        'Alaska': 0,
        'North West Territory': 0,
        'Alberta': 0,
        'Ontario': 0,
        'Quebec': 0,
        'Greenland': 0,
        'Western United States': 0,
        'Eastern United States': 0,
        'Central America': 0,
        'Venezuela': 0,
        'Brazil': 0,
        'Peru': 0,
        'Argentina': 0,
        'Iceland': 0,
        'Great Britain': 0,
        'Western Europe': 0,
        'Southern Europe': 0,
        'Northern Europe': 0,
        'Scandinavia': 0,
        'Ukraine': 0,
        'Ural': 0,
        'Serbia': 0,
        'Yakutsk': 0,
        'Kamchatka': 0,
        'Irkutsk': 0,
        'Mongolia': 0,
        'Afghanistan': 0,
        'China': 0,
        'India': 0,
        'Slam': 0,
        'Japan': 0,
        'Middle East': 0,
        'Egypt': 0,
        'East Africa': 0,
        'Congo': 0,
        'South Africa': 0,
        'North Africa': 0,
        'Madagascar': 0,
        'Indonesia': 0,
        'New Guinea': 0,
        'Western Australia': 0,
        'Eastern Australia': 0
      } 
    };

    // Shuffle the territories
    const shuffledTerritories = shuffleArray(territories);

    if (gameInfo.gameMode === 'Local') {
      // Create a new Risk game object
      const newLocalGame = {
        _id: ObjectId.createFromHexString(userId), // MongoDB will take the userId and use that ObjectId as the gameId (this means that a user can only have one active local multiplayer risk game saved at a time).
        playerNames: gameInfo.playerNames,
        territories: shuffledTerritories,
        player_turn: gameInfo.playerNames[0], // Index of the current player in the players array
        winner: null,
        reinforcements: {}, // Reinforcements for each player
        game_phase: 'initial_placement', // Game phases: 'initial_placement', 'attack', 'fortify', etc.
        created_at: new Date(),
        updated_at: new Date()
      };

      // Assign territories to players in order (the math on this was suprisingly difficult...)
      let currentIndex = 0;
      for (let i = 0; i < newLocalGame.playerNames.length; i++) {
        for (let j = 0; j < Math.floor(newLocalGame.territories.length / newLocalGame.playerNames.length); j++) {
          newLocalGame.territories[currentIndex].owner = newLocalGame.playerNames[i].toString();
          currentIndex++;
        }
      }

      // Remaining territories
      const remainingTerritories = newLocalGame.territories.length % newLocalGame.playerNames.length;
      for (let i = 0; i < remainingTerritories; i++) {
        newLocalGame.territories[currentIndex].owner = newLocalGame.playerNames[i % newLocalGame.playerNames.length].toString();
        currentIndex++;
      }


      // Insert the new game document into the Risk collection
      const result = await db.collection('Risk').insertOne(newLocalGame);

      console.log(`Risk game created with ID: ${result.insertedId}`);
    }
  } finally {
    await client.close();
  }
}

// Define players
const players = [
  { name: "Player 1", color: "", territories: [], troops: 0 },
  { name: "Player 2", color: "", territories: [], troops: 0 },
  { name: "Player 3", color: "", territories: [], troops: 0 },
  { name: "Player 4", color: "", territories: [], troops: 0 },
  { name: "Player 5", color: "", territories: [], troops: 0 },
  { name: "Player 6", color: "", territories: [], troops: 0 },
  // 6 sets of possible armies & let users choose which color(done seperatly)
];

// allow players to choose their color
function choosePlayerColor(player) {
  // create UI component to display color options and handle user input
  // the function returns the chosen color
  const chosenColor = /* Function to get user input for color selection */;
  
  // Assign the chosen color to the player
  player.color = chosenColor;
}

// initialize the game
function initializeGame() { // add dice roll?
  // Assign territories to players / ownership
  const territoriesPerPlayer = Math.floor(shuffledTerritories.length / players.length);
    let currentPlayerIndex = 0;
    for (let i = 0; i < shuffledTerritories.length; i++) { // assigned 1-by-1
        const territory = shuffledTerritories[i];
        players[currentPlayerIndex].territories.push(territory);
        // console.log(gameBoard.ownership[territory]); // for debugging
        gameBoard.ownership[territory] = players[currentPlayerIndex].name; // ownership of territory = player name
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
    console.log(players);
  // Distribute initial troops
  const totalInitialTroops = 50; // Total number of troops to distribute ; depends on amount of players
    const troopsPerTerritory = Math.floor(totalInitialTroops / shuffledTerritories.length); //
    for (let i = 0; i < shuffledTerritories.length; i++) {
        const territory = shuffledTerritories[i];
        const troopsToAdd = troopsPerTerritory + Math.floor(Math.random() * 3); // Random bonus troops for a territory
        // console.log(gameBoard.troops[territory]); // for debugging
        gameBoard.troops[territory] = troopsToAdd; // territory troops = rand# of troops
        // console.log(troopsToAdd); 
        players.find(player => player.territories.includes(territory)).troops += troopsToAdd;
        // console.log(troopsToAdd);
    }
}

// set up game
function setupGame() {
  // Allow each player to choose color
  for (let i = 0; i < players.length; i++) {
      choosePlayerColor(players[i]);
  }
  
  // initialize the game w/ chosen colors
  initializeGame();
}

// handle a player's turn NOT DONE
function playerTurn(player) {
  // Implement turn logic here
  // Allow the player to make legal moves
}

// define legal moves NOT DONE
const legalMoves = {
  placeTroops: function(player, territory, numTroops) {
      // Check if the player owns the territory
      // Check if the player has enough troops
      // Place troops on the territory
  },
  attackTerritory: function(player, fromTerritory, toTerritory, numTroops) {
      // Check if the attack is legal
      // Resolve the attack
  },
  moveTroops: function(player, fromTerritory, toTerritory, numTroops) {
      // Check if the move is legal
      // Move troops between territories
  },
  // add more possible legal moves
};

// Main game loop
function mainGameLoop() {
  // Loop through players
  for (let i = 0; i < players.length; i++) {
      const currentPlayer = players[i];
      playerTurn(currentPlayer);
      // Check win condition ; when all continents are conquored by player
      // need to think of what will be done for each player win or lose
  }
}

setupGame();

module.exports = {
  createRiskGame,
};
