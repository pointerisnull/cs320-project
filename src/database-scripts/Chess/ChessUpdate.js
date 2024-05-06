const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to update risk game information
async function updateChessGame(id, history) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Get reference to the database
        const db = client.db();
        
        console.log("Updating local chess game with id ", id);
        // Update the risk game information in the database
        await db.collection('Chess').updateOne(
            { _id: id }, 
            { $set: history } 
        );

        // console.log(await db.collection('Risk').findOne({ _id: gameId }));
        console.log('Chess game data updated successfully');
    } catch (error) {
        console.error('Error updating chess game information:', error);
        throw error; // Re-throw the error for handling elsewhere
    } finally {
        await client.close();
    }
}

module.exports = {
    updateRiskGame,
};
