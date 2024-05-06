const { updateRiskGame } = require('../database-scripts/Risk/RiskUpdate');
const { connectToDatabase } = require('../mongoConnection');

jest.mock('../mongoConnection', () => ({
  connectToDatabase: jest.fn(),
  client: {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        updateOne: jest.fn()
      }))
    })),
    close: jest.fn()
  }
}));

describe('updateRiskGame', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update local risk game information', async () => {
// Mock data
const gameData = {
    _id: '507f191e810c19729de860ea', // Replace with a valid ObjectId string
    game_mode: 'Local',
    playerNames: ['Player 1', 'Player 2'],
    players: [
      { name: 'Player 1', armies: 10 },
      { name: 'Player 2', armies: 10 },
    ],
    territories: [
      { name: 'Alaska', owner: null, armies: 3 },
      // Add other territories as needed
    ],
    player_turn: 'Player 1', // Assuming Player 1 is the first player
    winner: null,
    game_phase: 'reinforcement',
    control: [
      {
        region: 'North America',
        connections: [
          // Add connections as needed
        ],
        owner: null
      },
      // Add other continents as needed
    ],
    Cards: [], // Assuming an empty array for cards
    created_at: new Date(),
    updated_at: new Date()
  };

    // Call the function
    await updateRiskGame(gameData);

    // Assertions
    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(connectToDatabase).toHaveBeenCalledWith();

    // Add more expectations as needed
  });

  // Add more test cases as needed
});
