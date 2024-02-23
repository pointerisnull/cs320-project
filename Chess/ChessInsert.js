const { MongoClient, ObjectId } = require('mongodb');

// Connection URI
const uri = 'mongodb://jacob:Jakey0812!@207.246.81.16:27017/webappproject';

// Database Name
const dbName = 'webappproject';

// Function to create a new Chess game
async function createChessGame(player1Id, player2Id) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db(dbName);
    const ChessCollection = database.collection('Chess');

    // Create a new game document
    const newGame = {
      _id: new ObjectId(), // MongoDB will generate a unique ObjectId
      players: [
        { user_id: ObjectId(player1Id) },
        { user_id: ObjectId(player2Id) }
      ],
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
      current_turn: ObjectId(player1Id),
      winner: null,
      moves: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    // Inserts the new game document into the collection
    const result = await ChessCollection.insertOne(newGame);

    console.log(`Game created with ID: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

module.exports = {
  createChessGame,
};