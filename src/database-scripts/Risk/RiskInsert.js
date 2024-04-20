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

// Function to create a new Risk game
async function createRiskGame(userId, gameInfo) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Create a new Risk game object
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
      { name: 'Siberia', owner: null, armies: 2 },
      { name: 'Yakutsk', owner: null, armies: 3 },
      { name: 'Kamchatka', owner: null, armies: 2 },
      { name: 'Irkutsk', owner: null, armies: 3 },
      { name: 'Mongolia', owner: null, armies: 2 },
      { name: 'Afghanistan', owner: null, armies: 3 },
      { name: 'China', owner: null, armies: 2 },
      { name: 'India', owner: null, armies: 3 },
      { name: 'Siam', owner: null, armies: 2 },
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

    if (gameInfo.gameMode === 'Local') {
      // Create a new Risk game object
      const newLocalGame = {
        _id: ObjectId.createFromHexString(userId), // MongoDB will take the userId and use that ObjectId as the gameId (this means that a user can only have one active local multiplayer risk game saved at a time).
        playerNames: gameInfo.playerNames,
        territories: shuffledTerritories,
        player_turn: gameInfo.playerNames[0], // Index of the current player in the players array
        winner: null,
        reinforcements: {}, // Reinforcements for each player
        game_phase: 'reinforcement', // Game phases: 'reinforcement', 'attack', 'fortify', etc.
        created_at: new Date(),
        updated_at: new Date()
      };

      // Assign territories to players in order
      for (let i = 0; i < newLocalGame.territories.length; i++) {
        const playerIndex = i % newLocalGame.playerNames.length;
        newLocalGame.territories[i].owner = newLocalGame.playerNames[playerIndex].toString();
      }

      // // create a collection named 'regions' with documents representing polygon regions

      // // 1. Create a 2D geospatial index on the polygon coordinates
      // db.regions.createIndex({ "geometry.coordinates": "2dsphere" });

      // // 2. Query for adjacent regions based on a given region
      // const adjacentRegions = db.regions.find({
      //   geometry: {
      //     $geoIntersects: {
      //       $geometry: {
      //         type: "Polygon",
      //         coordinates: [/* Coordinates of the given polygon */]
      //       }
      //     }
      //   }
      // });

      // // Process the adjacentRegions result as needed


      // Insert the new game document into the Risk collection
      const result = await db.collection('Risk').insertOne(newLocalGame);

      console.log(`Risk game created with ID: ${result.insertedId}`);
    }
  } finally {
    await client.close();
  }
}

module.exports = {
  createRiskGame,
};
