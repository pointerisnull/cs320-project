const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to create a new User
async function createUser(user_name, password, email, avatar) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Get reference to the database
        const db = client.db();

        // Create a new user object
        const newUser = {
            _id: new ObjectId(),
            user_name: user_name,
            password: password,
            email: email,
            avatar: avatar,
            balance: 100
        };

        // Insert the new user into the UserInformation collection
        const insert = await db.collection('UserInformation').insertOne(newUser);
        
        console.log(`User created with ID: ${insert.insertedId}`);
    } 
    catch (error) {
        console.error('Error inserting new user:', error);
    } 
    finally {
        await client.close();
    }
}

module.exports = {
    createUser,
};
