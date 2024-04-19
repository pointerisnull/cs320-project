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

function endGame(draw) {
  if (draw) {
    alert('Draw!');
  } else {
    alert(`Player ${currentPlayer} wins!`);
  }
  gameActive = false;
}
