const { ObjectId } = require('mongodb');
const { createRiskGame } = require('../database-scripts/Risk/RiskInsert');
const { connectToDatabase } = require('../mongoConnection');

// Mock MongoDB client and collection
jest.mock('../mongoConnection', () => ({
    connectToDatabase: jest.fn(),
    client: {
      db: jest.fn(() => ({
        collection: jest.fn(() => ({
          findOne: jest.fn(),
          deleteOne: jest.fn(),
          insertOne: jest.fn(() => ({
            insertedId: 'some-id' // Replace 'some-id' with an ObjectId string
          })),
          updateOne: jest.fn() // Mock the updateOne method
        })),
      })),
      close: jest.fn(),
    },
  }));

describe('createRiskGame', () => {
  let userData, gameInfo;

  beforeEach(() => {
    let mockUserId = '507f191e810c19729de860ea'; // A valid ObjectId string
    userData = {
      _id: mockUserId,
      games_played: 0,
      balance: 100,
    };
    gameInfo = {
      gameMode: 'Local',
      playerNames: ['Player 1', 'Player 2'],
      players: [
        { name: 'Player 1', armies: 10 },
        { name: 'Player 2', armies: 10 },
      ],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new Risk game', async () => {
    await createRiskGame(userData, gameInfo);
    expect(connectToDatabase).toHaveBeenCalledTimes(2);
    expect(connectToDatabase).toHaveBeenCalledWith();
    // Add more expectations as needed
  });

  // Add more test cases as needed
});
