// This file sets up the connection between this project folder and our database
const { MongoClient } = require('mongodb');

// MongoDB connection URI (this uri should work for most systems)
const uri = 'mongodb://127.0.0.1:27017/webappproject';
// Create a new MongoDB client instance
const client = new MongoClient(uri);

// Function to connect to the MongoDB database
async function connectToDatabase() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to the database');
    // Return the database instance
    return client.db(); // Return the database instance
  
  } catch (err) {
    // Log and throw error if connection fails
    console.error('Error connecting to the database', err);
    throw err;
  }
}

module.exports = { connectToDatabase, client };
