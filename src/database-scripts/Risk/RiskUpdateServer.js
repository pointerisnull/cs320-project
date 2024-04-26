const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to update risk server information
async function updateRiskServer(data) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Get reference to the database
        const db = client.db();
        
        const serverData = data.server;
        const serverId = ObjectId.createFromHexString(serverData._id);
        delete serverData._id;

        console.log("Updating risk server with id ", serverId);
        // Update the risk game information in the database
        await db.collection('Risk_Servers').updateOne(
            { _id: serverId }, // Use the string representation directly
            { $set: serverData } // Update local risk game information
        );

        // console.log(await db.collection('Risk').findOne({ _id: gameId }));
        console.log('Risk server data updated successfully');
    } catch (error) {
        console.error('Error updating risk server information:', error);
        throw error; // Re-throw the error for handling elsewhere
    } finally {
        await client.close();
    }
}

module.exports = {
    updateRiskServer,
};
