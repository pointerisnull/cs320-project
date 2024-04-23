const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to update risk game information
async function updateRiskGame(gameData) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Get reference to the database
        const db = client.db();
        
        const gameId = ObjectId.createFromHexString(gameData._id);
        gameData.updated_at = new Date();
        delete gameData._id;

        console.log("Updating local risk game with id ", gameId);
        // Update the risk game information in the database
        await db.collection('Risk').updateOne(
            { _id: gameId }, // Use the string representation directly
            { $set: gameData } // Update local risk game information
        );

        // console.log(await db.collection('Risk').findOne({ _id: gameId }));
        console.log('Local risk game data updated successfully');
    } catch (error) {
        console.error('Error updating local risk game information:', error);
        throw error; // Re-throw the error for handling elsewhere
    } finally {
        await client.close();
    }
}

module.exports = {
    updateRiskGame,
};
