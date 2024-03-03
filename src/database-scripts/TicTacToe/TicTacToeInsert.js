const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to create a new TicTacToe game
async function createTicTacToeGame(player1Id, player2Id) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Get reference to the database
    const db = client.db();

    // Create a new Tic Tac Toe game object
    const newGame = {
      _id: new ObjectId(),
      players: [player1Id.toString(), player2Id.toString()],
      board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
      currentPlayer: player1Id.toString(),
      winner: null,
      gameOver: false,
    };

    // Insert the new game into the TicTacToe collection
    const result = await db.collection('TicTacToe').insertOne(newGame);

    console.log(`Tic Tac Toe game created with ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Error inserting Tic Tac Toe game:', error);
  } finally {
      await client.close();
  }
}

module.exports = {
 createTicTacToeGame,
};