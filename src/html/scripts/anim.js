// Chess
function piecesDisplay(altInfo) {
  alert("clicked on piece " + altInfo);
}
function boardDisplay(altInfo) {
  alert("clicked on square " + altInfo);
}

// Tic Tac Toe
function anim() { // https://www.w3schools.com/jsref/met_win_settimeout.asp
  l = document.getElementById("win");
  o0 = document.getElementById("0x0");
  o1 = document.getElementById("1x1");
  o2 = document.getElementById("1x2");
  o3 = document.getElementById("2x2");
  x0 = document.getElementById("0x1");
  x1 = document.getElementById("0x2");
  x2 = document.getElementById("1x0");

  o2.style.fill = "#000000";
  x1.style.fill = "#00000000";
  o0.style.fill = "#00000000";
  x0.style.fill = "#00000000";
  o3.style.fill = "#00000000";
  x2.style.fill = "#00000000";
  o1.style.fill = "#00000000";
  l.style.stroke = "#00000000";
  setTimeout(function () { x1.style.fill = "#000000" }, 1000);
  setTimeout(function () { o0.style.fill = "#000000" }, 2000);
  setTimeout(function () { x0.style.fill = "#000000" }, 3000);
  setTimeout(function () { o3.style.fill = "#000000" }, 4000);
  setTimeout(function () { x2.style.fill = "#000000" }, 5000);
  setTimeout(function () { o1.style.fill = "#000000" }, 6000);
  setTimeout(function () { l.style.stroke = "#000000" }, 7000);
}

// hard coded game
const cells = document.querySelectorAll('[data-cell]');
let currentPlayer = 'X';
let gameActive = true;

cells.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== '') return;
  cell.textContent = currentPlayer;
  if (checkWin()) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapPlayer();
  }
}

function checkWin() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  return winConditions.some(condition => {
    return condition.every(index => {
      return cells[index].textContent === currentPlayer;
    });
  });
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.textContent !== '';
  });
}

function endGame(draw) {
  if (draw) {
    alert('Draw!');
  } else {
    alert(`Player ${currentPlayer} wins!`);
  }
  gameActive = false;
}

function swapPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Risk
