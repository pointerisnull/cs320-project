let legal_squares = [];
let turn = true;
const board_squares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piece_images = document.getElementsByTagName("img");
  
/*returns the color of piece in a square (if any)*/
function is_occupied(square) {
  if (square.querySelector(".piece")) {
    const color = square.querySelector(".piece").getAttribute("color");
    return color;
  } else {
    return "empty";
  }
}

function allow_drop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  const piece = ev.target;
  const color = piece.getAttribute("color");
  if ((turn && color == "white") || (!turn && color == "black")) {
    ev.dataTransfer.setData("text", piece.id);
  }
}

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  const piece = document.getElementById(data);
  const destination = ev.currentTarget;
  const destination_id = destination.id;
  const color = piece.getAttribute("color");

  if (is_occupied(destination) == "empty") {
    destination.appendChild(piece);
    turn = !turn;
  } else {
    /*capture enemy pieces and prevent self-capture*/
    if (turn == true && color == "white" && is_occupied(destination) == "black") {
      destination.removeChild(destination.firstChild);
      destination.appendChild(piece);
      turn = !turn;
    } else if (turn == false && color == "black" && is_occupied(destination) == "white") {
      destination.removeChild(destination.firstChild);
      destination.appendChild(piece);
      turn = !turn;
    }
  }
}

function init_board() {
  for (let i = 0; i < board_squares.length; i++) {
    board_squares[i].addEventListener("dragover", allow_drop);
    board_squares[i].addEventListener("drop", drop);
    let row = Math.floor(i/8);
    let col = String.fromCharCode(97+(i%8));
    let current_square = board_squares[i];
    current_square.id = col+row;
    console.log(current_square.id);
  }
}

function init_pieces() {
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener("dragstart", drag);
    pieces[i].setAttribute("draggable", true);
    pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
  }
  for (let i = 0; i < piece_images.length; i++) {
    piece_images[i].setAttribute("draggable", false);
  }
}

init_board();
init_pieces();
