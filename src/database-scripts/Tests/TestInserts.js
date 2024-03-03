const { ObjectId } = require('mongodb');
const { createUser } = require('../User/UserInsert');
const { createTicTacToeGame } = require('../TicTacToe/TicTacToeInsert');
const { createChessGame } = require('../Chess/ChessInsert');
const { createRiskGame } = require('../Risk/RiskInsert');

// Generates a random id to be used as a playerId for testing
const generateRandomObjectId = () => {
    return new ObjectId();
}

// Creates 6 unique playerIds
const player1Id = generateRandomObjectId();
const player2Id = generateRandomObjectId();
const player3Id = generateRandomObjectId();
const player4Id = generateRandomObjectId();
const player5Id = generateRandomObjectId();
const player6Id = generateRandomObjectId();

// Creates an example user_name, password, and email to be used for testing
const user_name = "CoolGuy123";
const password = "pa55w0rD";
const email = "coolEmail@example.com";

// Creates an array of the above playerIds to be used specifically for Risk
const playerIdsArray = [player1Id, player2Id, player3Id, player4Id, player5Id, player6Id];

// When this file is ran, the below line captures the third argument in the command line, which should be 'user' or one of the three games
const args = process.argv.slice(2).map(arg => arg.toLowerCase());

// A document in the corresponding collection is created based on what argument was passed in the command-line
if(args.includes('user')) {
    createUser(user_name, password, email);
}
else if(args.includes('tictactoe')) {
    createTicTacToeGame(player1Id, player2Id);  
} 
else if(args.includes('chess')) {
    createChessGame(player1Id, player2Id);
}
else if(args.includes('risk')) {
    createRiskGame(playerIdsArray);  
}
