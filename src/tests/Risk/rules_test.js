// tests/unit/test_functions.js

// Import the functions to test
const { getPlayerIndexByName, getCardIndexByName } = require('C:/Users/nesze/CS320/cs320-project/src/html/scripts/gamez/Risk/Risk_rules.js').getPlayerIndexByName;

// Mock gameData for testing
const gameData = {
    players: [
        { name: "Alice" },
        { name: "Bob" },
        { name: "Charlie" }
    ],
    Cards: [
        { territory: { name: "Card1" } },
        { territory: { name: "Card2" } },
        { territory: { name: "Card3" } }
    ]
};


// Define a simple assert function to check conditions
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

// Test cases for getPlayerIndexByName
function testGetPlayerIndexByName() {
    // Test case 1: Finds the index of an existing player by name
    assert(getPlayerIndexByName("Bob", gameData) === 1, "Test case 1 failed");

    // Test case 2: Returns -1 when player with given name is not found
    assert(getPlayerIndexByName("David", gameData) === -1, "Test case 2 failed");

    // Test case 3: Returns -1 when gameData.players is empty
    const emptyGameData = { players: [] };
    assert(getPlayerIndexByName("Alice", emptyGameData) === -1, "Test case 3 failed");

    // Test case 4: Returns -1 when playerName is not a string
    assert(getPlayerIndexByName(123, gameData) === -1, "Test case 4 failed");

    // Add more test cases for getPlayerIndexByName as needed
}

function testGetCardIndexByName() {
    // Test case 1: Finds the index of an existing card by name
    assert(getCardIndexByName("Card2", gameData) === 1, "Test case 1 failed");

    // Test case 2: Returns -1 when card with given name is not found
    assert(getCardIndexByName("Card4", gameData) === -1, "Test case 2 failed");

    // Test case 3: Returns -1 when gameData.Cards is empty
    const emptyGameData = { Cards: [] };
    assert(getCardIndexByName("Card1", emptyGameData) === -1, "Test case 3 failed");

    // Test case 4: Returns -1 when gainedCard is not a string
    assert(getCardIndexByName(123, gameData) === -1, "Test case 4 failed");

    // Add more test cases as needed
}

// Run all tests
function runAllTests() {
    testGetPlayerIndexByName();
    testGetCardIndexByName();
}

// Run all tests
runAllTests();
