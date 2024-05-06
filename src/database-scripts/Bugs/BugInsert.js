const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to create a new User
async function createBug(Bug, detail, mailBack) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Get reference to the database
        const db = client.db();

        // Create a new user object
        const newBug = {
            _id: new ObjectId(),
            Title: Bug,
            Description: detail,
            Mail_Back: mailBack
        };

        // Insert the new user into the UserInformation collection
        const insert = await db.collection('Bugs').insertOne(newBug);
        
        console.log(`Bug created with ID: ${insert.insertedId}`);
    } 
    catch (error) {
        console.error('Error inserting new bug:', error);
    } 
    finally {
        await client.close();
    }
}

module.exports = {
    createBug,
};
