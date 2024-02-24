// This file sets up the connection between this project folder and our database
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/webappproject';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to the database');
    return client.db(); // Return the database instance
  } catch (err) {
    console.error('Error connecting to the database', err);
    throw err;
  }
}

module.exports = { connectToDatabase, client };
