const { ObjectId } = require('mongodb');
const { createTicTacToeGame } = require('./TicTacToe/TicTacToeInsert');
const { createChessGame } = require('./Chess/ChessInsert');
const { createRiskGame } = require('./Risk/RiskInsert');

// Generates a random id to be used a playerId for testing
const generateRandomObjectId = () => {
    return new ObjectId();
}

const player1Id = generateRandomObjectId();
const player2Id = generateRandomObjectId();
const player3Id = generateRandomObjectId();
const player4Id = generateRandomObjectId();

createTicTacToeGame(player1Id, player2Id);
createChessGame(player1Id, player2Id);
createRiskGame(player1Id, player2Id, player3Id, player4Id);

// const { newGame } = require('./TicTacToeInsert');

// updateTicTacToeGame(newGame._id, {current_turn: ObjectId(player2Id), board_state: ["X", "", "", "", "O", "", "", "", ""],
// winner: player1Id, moves: [{user_id: ObjectId(player1Id), position: 4, symbol: "X"},
// {user_id: ObjectId(player2Id), position: 0, symbol: "O"}]});