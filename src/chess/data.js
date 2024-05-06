function new_game() {
  var opponentInput = document.getElementById("opponent");
  var opponent = opponentInput.value.trim();
  console.log(opponent);
  if (opponent !== "") {
    var gameList = document.getElementById("gameList");
                
    // Create a new game box
    var newGameBox = document.createElement("div");
    newGameBox.classList.add("game-box");
    newGameBox.onclick = function() {
      location.href = '../chess/game.html';
    };
                
    // Create image element
    var img = document.createElement("img");
    img.src = "./Media/gamez/Chess.png";
    img.alt = opponent;
    newGameBox.appendChild(img);
               
    // Create paragraph element for game name
    var paragraph = document.createElement("p");
    paragraph.textContent = opponent;
    newGameBox.appendChild(paragraph);
                
    // Add new game box to game list
    gameList.appendChild(newGameBox);
                
    // Clear the input field
    opponentInput.value = "";
  }
}

function load_game_from_db(opponent) {
  var gameList = document.getElementById("gameList");
  // Create a new game box
  var newGameBox = document.createElement("div");
  newGameBox.classList.add("game-box");
  newGameBox.onclick = function() {
    location.href = 'game.html';
  };
  // Create image element
  var img = document.createElement("img");
  img.src = "res/chess.png";
  img.alt = opponent;
  newGameBox.appendChild(img);
               
  // Create paragraph element for game name
  var paragraph = document.createElement("p");
  paragraph.textContent = opponent;
  newGameBox.appendChild(paragraph);
                
  // Add new game box to game list
  gameList.appendChild(newGameBox);
}
