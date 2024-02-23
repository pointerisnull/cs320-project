const { MongoClient, ObjectId } = require('mongodb');

// Connection URI
const uri = 'mongodb://127.0.0.1:27017/webappproject'';

// Database Name
const dbName = 'webappproject';

// Function to update an existing Tic Tac Toe game
async function updateTicTacToeGame(gameId, updatedData) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db(dbName);
    const TicTacToeCollection = database.collection('TicTacToe');

    // Update the existing game document
    const result = await TicTacToeCollection.updateOne(
      { _id: ObjectId(gameId) },
      {
        $set: {
          ...updatedData,
          updated_at: new Date(),
        },
      }
    );

    if (result.matchedCount > 0) {
      console.log(`Tic Tac Toe game with ID ${gameId} updated successfully`);
    } else {
      console.log(`Tic Tac Toe game with ID ${gameId} not found`);
    }
  } finally {
    await client.close();
  }
}
