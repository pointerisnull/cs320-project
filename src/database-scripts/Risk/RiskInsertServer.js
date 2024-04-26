const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to create a new Risk game
async function createRiskServer(serverData) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Create a new Risk game object
        const db = client.db();

        // Create a new Risk game object
        const newRiskServer = {
            _id: ObjectId.createFromHexString(serverData.host), // MongoDB will take the userId of the host and use that ObjectId as the serverId.
            serverName: serverData.serverName,
            playerIds: serverData.playerIds,
        };

        // Insert the new game document into the Risk collection
        const result = await db.collection('Risk_Servers').insertOne(newRiskServer);

        console.log(`Risk server created with ID: ${result.insertedId}`);
    }
    finally {
        await client.close();
    }
}

module.exports = {
  createRiskServer,
};
