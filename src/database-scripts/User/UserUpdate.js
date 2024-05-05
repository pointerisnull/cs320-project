const { connectToDatabase, client } = require('../../mongoConnection');
const { ObjectId } = require('mongodb');

// Function to update user information
async function updateUser(userId, updatedInfo) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Get reference to the database
        const db = client.db();

        const userIdObject = ObjectId.createFromHexString(userId);
        if(updatedInfo._id) {
            delete updatedInfo._id;
        }

        console.log("Updating ", userId, "'s", updatedInfo);
        // Update the user information in the database
        await db.collection('UserInformation').updateOne(
            { _id: userIdObject }, // Use the string representation directly
            { $set: updatedInfo } // Update user information
        );
        
        console.log('User information updated successfully');
    } catch (error) {
        console.error('Error updating user information:', error);
        throw error; // Re-throw the error for handling elsewhere
    } finally {
        await client.close();
    }
}

module.exports = {
    updateUser,
};
