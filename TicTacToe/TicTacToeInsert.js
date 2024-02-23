const { MongoClient, ObjectId } = require('mongodb');

// Connection URI
const uri = 'mongodb://jacob:Jakey0812!@207.246.81.16:27017/webappproject'

// Database Name
const dbName = 'webappproject';

// Function to create a new Tic Tac Toe game
async function createTicTacToeGame(player1Id, player2Id) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db(dbName);
    const TicTacToeCollection = database.collection('TicTacToe');

    // Create a new game document
    const newGame = {
      _id: new ObjectId(), // MongoDB will generate a unique ObjectId
      players: [
        { user_id: ObjectId(player1Id) },
        { user_id: ObjectId(player2Id) }
      ],
      board_state: ["", "", "", "", "", "", "", "", ""],
      current_turn: ObjectId(player1Id),
      winner: null,
      moves: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    // Insert the new game document into the collection
    const result = await TicTacToeCollection.insertOne(newGame);

    console.log(`Game created with ID: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

module.exports = {
  createTicTacToeGame,
}