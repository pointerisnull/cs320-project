// This file takes retrieves the data from our database and helps to send it client-side.

const { connectToDatabase } = require('../mongoConnection');

async function handleUserDataRequest(req, res, username) {
    console.log('Handling user data request...');
    try {
        const db = await connectToDatabase();
        const userInformationCollection = db.collection('UserInformation');

        // Fetch all documents from UserInformation collection
        const userData = await userInformationCollection.findOne({ user_name: username });

        // Send the data to the client
        res.end(JSON.stringify(userData));
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.end('Internal Server Error');
    }
}

module.exports = {
    handleUserDataRequest,
};