// This file is what creates a token for each individual user. These tokens allow us to identify every user uniquely.

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secretKey = generateSecretKey();

// Function to generate JWT token
function generateToken(username) {
    return jwt.sign(username, secretKey, { expiresIn: 3600 }); // Expires in 1 hour (3600 seconds)
}

// Function to verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null; // Token is invalid
    }
}

function generateSecretKey() {
    return crypto.randomBytes(32).toString('hex'); // Generate a 256-bit (32-byte) random string
};

module.exports = { secretKey, generateToken, verifyToken };