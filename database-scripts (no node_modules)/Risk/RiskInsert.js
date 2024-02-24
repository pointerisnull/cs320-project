const { connectToDatabase, client } = require('../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to shuffle an array (mainly used for the territories field)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to create a new Risk game
async function createRiskGame(playerIds) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Create a new Chess game object
    const db = client.db();

    // Territories to be shuffled and assigned
    const territories = [
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
    ];

    // Shuffle the territories
    const shuffledTerritories = shuffleArray(territories);

    // Create a new Risk game object
    const newGame = {
      _id: new ObjectId(), // MongoDB will generate a unique ObjectId which will act as the gameId
      players: playerIds.map(playerId => ({ user_id: playerId })),
      territories: shuffledTerritories,
      player_turn: 0, // Index of the current player in the players array
      winner: null,
      reinforcements: {}, // Reinforcements for each player
      game_phase: 'initial_placement', // Game phases: 'initial_placement', 'attack', 'fortify', etc.
      created_at: new Date(),
      updated_at: new Date()
    };

    // Assign territories to players in order
    newGame.players.forEach((player, index) => {
      newGame.territories[index].owner = player.user_id.toString();
    });

    // Insert the new game document into the Risk collection
    const result = await db.collection('Risk').insertOne(newGame);

    console.log(`Risk game created with ID: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

module.exports = {
  createRiskGame,
};
