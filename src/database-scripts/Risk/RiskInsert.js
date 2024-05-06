const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');
const { updateUser } = require('../User/UserUpdate');

// Function to shuffle an array (mainly used for the territories field)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to create a new Risk game
async function createRiskGame(userData, gameInfo) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Create a new Risk game object
    const db = client.db();

    // Delete current game if there is one.
    console.log("Checking Risk database for duplicate game...");
    const gameId = ObjectId.createFromHexString(userData._id);
    const currentGame = await db.collection('Risk').findOne({_id: gameId});
    if(currentGame) {
      console.log("Deleting duplicate Risk game...");
      await db.collection('Risk').deleteOne({_id: gameId});
      console.log("Deleted duplicate Risk game");
    }

    // Territories to be shuffled and assigned
    const territories = [
      { name: 'Alaska', owner: null, armies: 3 },
      { name: 'North West Territory', owner: null, armies: 2 },
      { name: 'Alberta', owner: null, armies: 3 },
      { name: 'Ontario', owner: null, armies: 2 },
      { name: 'Quebec', owner: null, armies: 3 },
      { name: 'Greenland', owner: null, armies: 2 },
      { name: 'Western United States', owner: null, armies: 3 },
      { name: 'Eastern United States', owner: null, armies: 2 }, // North America
      { name: 'Central America', owner: null, armies: 3 },
      { name: 'Venezuela', owner: null, armies: 2 },
      { name: 'Brazil', owner: null, armies: 3 },
      { name: 'Peru', owner: null, armies: 2 },
      { name: 'Argentina', owner: null, armies: 3 }, // South America
      { name: 'Iceland', owner: null, armies: 2 },
      { name: 'Great Britain', owner: null, armies: 3 },
      { name: 'Western Europe', owner: null, armies: 2 },
      { name: 'Southern Europe', owner: null, armies: 3 },
      { name: 'Northern Europe', owner: null, armies: 2 },
      { name: 'Scandinavia', owner: null, armies: 3 },
      { name: 'Ukraine', owner: null, armies: 2 }, // Europe
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
      { name: 'Middle East', owner: null, armies: 2 }, // Asia
      { name: 'Egypt', owner: null, armies: 2 },
      { name: 'East Africa', owner: null, armies: 3 },
      { name: 'Congo', owner: null, armies: 2 },
      { name: 'South Africa', owner: null, armies: 3 },
      { name: 'North Africa', owner: null, armies: 2 },
      { name: 'Madagascar', owner: null, armies: 3 }, // Africa
      { name: 'Indonesia', owner: null, armies: 2 },
      { name: 'New Guinea', owner: null, armies: 3 },
      { name: 'Western Australia', owner: null, armies: 2 },
      { name: 'Eastern Australia', owner: null, armies: 2 } // Australia
    ];

    // connections array (hard coded it so if the map ever changes i guess it might be glitchy sry)
    const continents = [
      {
        region: "North America",
        connections: [territories[0], territories[1], territories[2], territories[3], territories[4], territories[5], territories[6], territories[7]],
        owner: null
      },
      {
        region: "South America",
        connections: [territories[8], territories[9], territories[10], territories[11], territories[12]],
        owner: null
      },
      {
        region: "Europe",
        connections: [territories[13], territories[14], territories[15], territories[16], territories[17], territories[18], territories[19]],
        owner: null
      },
      {
        region: "Asia",
        connections: [territories[20], territories[21], territories[22], territories[23], territories[24], territories[25], territories[26], territories[27], territories[28], territories[29], territories[30], territories[31]],
        owner: null
      },
      {
        region: "Africa",
        connections: [territories[32], territories[33], territories[34], territories[35], territories[36], territories[37]],
        owner: null
      },
      {
        region: "Australia",
        connections: [territories[38], territories[39], territories[40], territories[41]],
        owner: null
      }
    ];

    // Shuffle the territories
    const shuffledTerritories = shuffleArray(territories);

    function createDeck() {
      const troopTypes = ['Infantry', 'Cavalry', 'Artillery'];
      let deck = []; // 44 cards : 42 territory:troopType; 2 wild troopType

      shuffleArray(troopTypes);

      territories.forEach((territory, index) => { // create 42 cards with territories
        const troopType = troopTypes[index % troopTypes.length]; // pick a troopType from shuffled troopType array

        const card = { // card object
          territory: territory,
          troopType: troopType
        };
        deck.push(card);
      });

      const wildCard = {
        territory: 'Wild Card',
        troopType: troopTypes
      };
      deck.push(wildCard);
      deck.push(wildCard);

      return deck;
    }

    // Create a new Risk game object
    const newGame = {
      _id: ObjectId.createFromHexString(userData._id), // MongoDB will take the userData._id and use that ObjectId as the gameId (this means that a user can only have one active local multiplayer risk game saved at a time).
      game_mode: gameInfo.gameMode,
      playerNames: gameInfo.playerNames,
      players: gameInfo.players,
      territories: shuffledTerritories,
      player_turn: gameInfo.players[0].name, // Index of the current player in the players array
      winner: null,
      game_phase: 'reinforcement', // Game phases: 'reinforcement', 'attack', 'fortify', etc.
      control: continents,
      Cards: new createDeck(),
      created_at: new Date(),
      updated_at: new Date()
    };

    // Assign territories to players in order
    for (let i = 0; i < newGame.territories.length; i++) {
      const playerIndex = i % newGame.playerNames.length;
      newGame.territories[i].owner = newGame.playerNames[playerIndex].toString();
    }

    // Insert the new game document into the Risk collection
    const result = await db.collection('Risk').insertOne(newGame);

    if(result) {
      userData.games_played += 1;
      if (gameInfo.gameMode === 'Computer') {
        userData.balance -= 10;
      }
      await updateUser(userData._id, userData);
    }
    console.log(`Risk game created with ID: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

module.exports = {
  createRiskGame,
};
