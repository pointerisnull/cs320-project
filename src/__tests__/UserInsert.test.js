const { createUser } = require('../database-scripts/User/UserInsert');
const { connectToDatabase } = require('../mongoConnection');

jest.mock('../mongoConnection', () => ({
  connectToDatabase: jest.fn(),
  client: {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        insertOne: jest.fn()
      }))
    })),
    close: jest.fn()
  }
}));

describe('createUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    // Mock data
    const userName = 'testUser';
    const password = 'testPassword';
    const email = 'test@example.com';
    const avatar = 'avatar.jpg';

    // Call the function
    await createUser(userName, password, email, avatar);

    // Assertions
    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(connectToDatabase).toHaveBeenCalledWith();

    // Add more expectations as needed
  });

  // Add more test cases as needed
});
