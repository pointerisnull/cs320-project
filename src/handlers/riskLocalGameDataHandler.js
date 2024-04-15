// This file takes retrieves the data from our database and helps to send it client-side.

const { connectToDatabase } = require('../mongoConnection');
const { ObjectId } = require('mongodb');

async function handleLocalRiskGameDataRequest(req, res, userId) {
    console.log('Handling local risk  game data request...');
    try {
        const db = await connectToDatabase();
        const riskCollection = db.collection('Risk');

        // Fetch all documents from UserInformation collection
        const gameData = await riskCollection.findOne({ _id: ObjectId.createFromHexString(userId) });
        console.log("Found game data for local risk game: ", JSON.stringify(gameData, null, 2));

        // Send the data to the client
        res.end(JSON.stringify(gameData));
    } catch (error) {
        console.error('Error fetching local risk game data:', error);
        res.end('Internal Server Error');
    }
}

module.exports = {
    handleLocalRiskGameDataRequest,
};