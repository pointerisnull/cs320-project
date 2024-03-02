const { connectToDatabase, client } = require('../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to create a new Chess game
async function createChessGame(player1Id, player2Id) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Get reference to the database
    const db = client.db();

    // Create a new Chess game object
    const newGame = {
      _id: new ObjectId(), // MongoDB will generate a unique ObjectId
      players: [player1Id.toString(), player2Id.toString()],
      board_state: [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ],
      current_turn: player1Id.toString(),
      winner: null,
      moves: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    // Inserts the new game document into the Chess collection
    const result = await db.collection('Chess').insertOne(newGame);

    console.log(`Chess game created with ID: ${result.insertedId}`);
  } finally {
      await client.close();
  }
}

module.exports = {
  createChessGame,
};
