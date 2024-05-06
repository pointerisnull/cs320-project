let captured_pieces = [];
let turn = true;
let history = "";

var board_squares = document.getElementsByClassName("square");
var pieces = document.getElementsByClassName("piece");
var piece_images = document.getElementsByTagName("img");

var default_board = $("#board").html();
var ghost_board = board_squares;
var ghost_pieces = pieces;

var move_audio = new Audio('res/move.mp3'); 
var capture_audio = new Audio('res/capture.mp3'); 
var check_audio = new Audio('res/check.mp3'); 
  
/*returns the color of piece in a square (if any)*/
function is_occupied(square) {
  if (square.querySelector(".piece")) {
    const color = square.querySelector(".piece").getAttribute("color");
    return color;
  } else {
    return "empty";
  }
}

function check_coords(col, row) {
  const char_col = String.fromCharCode(col+96);
  const char_row = row.toString();
  const coords = char_col + char_row;
  let square;
  for (let i = 0; i < board_squares.length; i++) {
    if (board_squares[i].id == coords)
      square = board_squares[i];
  }

  return is_occupied(square);
}

function get_square(id) {
  for (let i = 0; i < board_squares.length; i++) {
    if(board_squares[i].id == id)
      return board_squares[i];
  }
}

function hide_legal_squares() {
  for (let i = 0; i < board_squares.length; i++) {
    if (board_squares[i].classList.contains("active"))
      board_squares[i].classList.remove("active");
  }
}

function show_legal_squares(piece) {
  for (let i = 0; i < board_squares.length; i++) {
    if (is_legal_move(piece, board_squares[i]))
      board_squares[i].classList.add("active");
  }
}

function simulate_move() {

}

function en_passant(fcol, frow, tocol, torow, occupation, color) {
  /*WIP*/
  /*if ((frow-torow == 1) &&  (tocol+1 == fcol || tocol-1 == fcol) && occupation == "empty" && color == "black")
    return true;
  else if ((torow-frow == 1) && (tocol+1 == fcol || tocol-1 == fcol) && occupation == "empty" && color == "white")
    return true;*/
  return false;
}

function is_check(color) {
  let king;
  let check = false;
  for (let i = 0; i < pieces.length; i++)
    if (pieces[i].classList.contains("king") && pieces[i].getAttribute("color") == color)
      king = pieces[i];
  
  const king_square = board_squares[king.square_id];
  
  for (let i = 0; i < pieces.length; i++) {
    if (is_legal_move(pieces[i], king_square))
      check = true;
  }
  if (check && !king_square.classList.contains("check"))
    king_square.classList.add("check");
  else if (!check)
    king_square.classList.remove("check");
  return check;
}

function pawn_promote(pawn) {
/*TODO*/
  
  pawn.classList.add("queen");
  pawn.classList.remove("pawn");
  pawn.id = "queen" + pawn.id[4] + pawn.id[5];
  console.log(pawn.id);
  if (pawn.getAttribute("color") == "white")
    pawn.children[0].setAttribute("src", "res/queen_white.svg"); 
  else
    pawn.children[0].setAttribute("src", "res/queen_black.svg"); 
  capture_audio.play();
  
}
/*piece legality*/
function pawn_legality(pawn, fcol, frow, tocol, torow, occupation, color) {
  let move = false;
  /*first move, pawn can move foward 2 spaces (optional)*/ 
  if (pawn.first_move) {
    pawn.fist_move = false;
    /*ONLY returns if moving two spaces foward*/
    if (color == "white") {
      if ((torow - frow == 1 || torow - frow == 2) && tocol == fcol && occupation == "empty") {
        pawn.en_passant = true;
        move = true;
      }
    } else if (color == "black") {
      if ((frow-torow == 1 || frow - torow == 2) &&  tocol == fcol && occupation == "empty") {
        pawn.en_passant = true;
        move = true;
      }
    }
  } else {
    pawn.en_passant = false;
  }
  /*normal case*/
  if (color == "white") {
    if ((torow-frow == 1) && tocol == fcol && occupation == "empty")
      move = true;
  } else if(color == "black") {
    if ((frow-torow == 1) &&  tocol == fcol && occupation == "empty")
      move = true;
  }
  /*attacking*/
  if (color == "white") {
    if ((torow-frow == 1) && (tocol+1 == fcol || tocol-1 == fcol) && occupation != "empty" && occupation != color)
      move = true;
    else if (en_passant(fcol, frow, tocol, torow, occupation, color))
      move = true;
   
  } else if (color == "black") {
    if ((frow-torow == 1) &&  (tocol+1 == fcol || tocol-1 == fcol) && occupation != "empty" && occupation != color)
      move = true;
    else if (en_passant(fcol, frow, tocol, torow, occupation, color))
      move = true;
  } 
  
  return move;
}

function rook_legality(piece, fcol, frow, tocol, torow, occupation, color) {
    if(frow == torow) {
      /*check if pieces are in the way*/
      if(tocol > fcol) {
        for(var colCheck = fcol+1; colCheck < tocol; colCheck++) {
          if(check_coords(colCheck, frow) != "empty") return false;
        }
      } else if(tocol < fcol) {
        for(var colCheck = tocol+1; colCheck < fcol; colCheck++) {
          if(check_coords(colCheck, frow) != "empty") return false;
        } 
      }
      if(occupation != "empty" && occupation == color) return false;
      return true;
    }
    /*vertical*/
    if(fcol == tocol) {
      if(frow < torow) {
        for(var rowCheck = frow+1; rowCheck < torow; rowCheck++) {
          if(check_coords(fcol, rowCheck) != "empty") return false;
        }
      } else if(torow < frow) {
        for(var rowCheck = torow+1; rowCheck < frow; rowCheck++) {
          if(check_coords(fcol, rowCheck) != "empty") return false;
        }
      }

      if(occupation != "empty" && occupation == color) return false;
      return true;
    }
    return false;
}


function bishop_legality(piece, fcol, frow, tocol, torow, occupation, color) {
    if (color == occupation) return false;
    //south east
    if(tocol > fcol && torow < frow) {
      var cdist = tocol - fcol;
      var rdist = frow - torow;
      if(cdist != rdist) {
        return false;
      } 
      let rowCheck = torow+1;
      let colCheck = tocol-1;
      while (rowCheck < frow) {
        if (check_coords(colCheck, rowCheck) != "empty")
          return false;
        rowCheck++;
        colCheck--;
      }
      return true;
    }
    //south west
    if(fcol > tocol && torow < frow) {
      var cdist = fcol - tocol;
      var rdist = frow - torow;
      if(cdist != rdist) {
        return false;
      }
      let rowCheck = torow+1;
      let colCheck = tocol+1;
      while (rowCheck < frow) {
        if (check_coords(colCheck, rowCheck) != "empty")
          return false;
        rowCheck++;
        colCheck++;
      }
      return true;
    }   
    //north east
    if(tocol > fcol && torow > frow) {
      var cdist = tocol - fcol;
      var rdist = torow - frow;
      if(cdist != rdist) {
        return false;
      }
      let rowCheck = torow-1;
      let colCheck = tocol-1;
      while (rowCheck > frow) {
        if (check_coords(colCheck, rowCheck) != "empty")
          return false;
        rowCheck--;
        colCheck--;
      }
 
      return true; 
    }

    //north west
    if(fcol > tocol && torow > frow) {
      var cdist = fcol - tocol;
      var rdist = torow - frow;
      if(cdist != rdist) {
        return false;
      } 
      let rowCheck = torow-1;
      let colCheck = tocol+1;
      while (rowCheck > frow) {
        if (check_coords(colCheck, rowCheck) != "empty")
          return false;
        rowCheck--;
        colCheck++;
      }
      return true;
    }   

    return false;
}

function knight_legality(piece, fcol, frow, tocol, torow, occupation, color) {
  if(color != occupation) {
    if((torow > 0 && torow <= 8) && (tocol > 0 && tocol <= 8)) {
      //north east
      if((frow - torow) == 2 && (tocol - fcol) == 1) return true;
      if((frow - torow) == 1 && (tocol - fcol) == 2) return true;
      //south east
      if((torow - frow) == 2 && (tocol - fcol) == 1) return true;
      if((torow - frow) == 1 && (tocol - fcol) == 2) return true;
      //north west
      if((frow - torow) == 2 && (fcol - tocol) == 1) return true;
      if((frow - torow) == 1 && (fcol - tocol) == 2) return true;
      //south west
      if((torow - frow) == 2 && (fcol - tocol) == 1) return true;
      if((torow - frow) == 1 && (fcol - tocol) == 2) return true;

      }
  }
  return false;
}

function king_legality(piece, fcol, frow, tocol, torow, occupation, color) {
  let move = false;
  if (color == "white") {
    //short castle
    if (piece.first_move && tocol - fcol == 2 && frow == torow) {
      if (is_occupied(get_square("g1")) == "empty" 
        && is_occupied(get_square("f1")) == "empty"
        && get_square("h1").children[0].first_move) {
        move = true;
      }
    } else if (piece.first_move && fcol - tocol == 3 && frow == torow) {
      if (is_occupied(get_square("b1")) == "empty" 
        && is_occupied(get_square("c1")) == "empty"
        && is_occupied(get_square("d1")) == "empty"
        && get_square("a1").children[0].first_move) {
        move = true;
      }
    }
  } else if (color == "black") {
    if (piece.first_move && tocol - fcol == 2 && frow == torow) {
      if (is_occupied(get_square("g8")) == "empty" 
        && is_occupied(get_square("f8")) == "empty"
        && get_square("h8").children[0].first_move) {
        move = true;
      }
    } else if (piece.first_move && fcol - tocol == 3 && frow == torow) {
      if (is_occupied(get_square("b8")) == "empty" 
        && is_occupied(get_square("c8")) == "empty"
        && is_occupied(get_square("d8")) == "empty"
        && get_square("a8").children[0].first_move) {
        move = true;
      }
    }
  }
  if(color != occupation) {
  //vertical
    if(tocol == fcol) 
      if(Math.abs(torow-frow) == 1) move = true;
      //horizontal
    if(torow == frow) 
      if(Math.abs(tocol-fcol) == 1) move = true;
    //diagonal
    if(Math.abs(tocol-fcol)==1 && Math.abs(frow-torow)==1) move = true;
  }
  return move;
}

function is_legal_move(piece, destination) {
  /*easier for calculations*/
  var from_col = piece.square_id[0].charCodeAt(0)-96;
  var from_row = Number(piece.square_id[1]);
  var to_col = destination.id[0].charCodeAt(0)-96;
  var to_row = Number(destination.id[1]);

  const current_color = piece.getAttribute("color");
  const occupation = is_occupied(destination);
  
  if (piece.classList.contains("pawn")) 
    return pawn_legality(piece, from_col, from_row, to_col, to_row, occupation, current_color);
  else if (piece.classList.contains("rook"))
    return rook_legality(piece, from_col, from_row, to_col, to_row, occupation, current_color);
  else if (piece.classList.contains("bishop"))
    return bishop_legality(piece, from_col, from_row, to_col, to_row, occupation, current_color);
  else if (piece.classList.contains("knight"))
    return knight_legality(piece, from_col, from_row, to_col, to_row, occupation, current_color);
  else if (piece.classList.contains("king"))
    return king_legality(piece, from_col, from_row, to_col, to_row, occupation, current_color);  
  else if (piece.classList.contains("queen")) {
    let diagonal = bishop_legality(piece, from_col, from_row, to_col, to_row, occupation, current_color);
    let horizontal = rook_legality(piece, from_col, from_row, to_col, to_row, occupation, current_color);
    if (horizontal) return horizontal;
    else if (diagonal) return diagonal;
  }

  return false;
}

function move_piece(from_square, to_square, is_special_move) {
  const piece = get_square(from_square).children[0];
  const destination = get_square(to_square);
  const destination_id = destination.id;
  const color = piece.getAttribute("color");

  if (is_occupied(destination) != "empty") {
    /*capture enemy pieces and prevent self-capture*/
    if (turn == true && color == "white" && is_occupied(destination) == "black") {
      /*destroy all children then append piece*/
      while(destination.firstChild) {
        destination.removeChild(destination.firstChild);
      }
    } else if (turn == false && color == "black" && is_occupied(destination) == "white") {
      /*destroy all children then append piece*/
      while(destination.firstChild) {
        destination.removeChild(destination.firstChild);
      } 
    }
  }
  
  destination.appendChild(piece);
  if (piece.classList.contains("pawn")) {
    if (color == "white" && destination_id[1] == '8')
      pawn_promote(piece);
    else if (color == "black" && destination_id[1] == '1')
      pawn_promote(piece);
  } else if (piece.classList.contains("king")) {
    //castling
    if (color == "white" && piece.first_move) {
      if (destination_id == "b1") {
        move_piece("a1", "c1", true);
      } else if (destination_id == "g1") {
        move_piece("h1", "f1", true);
      }
    } else if (color == "black" && piece.first_move) {
      if (destination_id == "b8") {
        move_piece("a8", "c8", true);
      } else if (destination_id == "g8") {
        move_piece("h8", "f8", true);
      }
    }
    for (let i = 0; i < board_squares.length; i++)
      if (board_squares[i].classList.contains("check") && is_occupied(board_squares[i]) == "empty")
      board_squares[i].classList.remove("check");
  }
  if (is_special_move == false) {
    turn = !turn;
    history = history + piece.square_id;
    history = history + destination_id;
    document.getElementById("turn").innerHTML = turn ? "White's Turn | " + history : "Black's Turn | " + history;
  }
  
  /*update the piece's coordinates*/
  piece.first_move = false;
  piece.square_id = destination_id;

  if (is_special_move == false) {
    if (is_check("white")) { 
      check_audio.play();
      if (color == "white")
        undo_move();
    }
    else if (is_check("black")) {
      check_audio.play();
      if (color == "black")
        undo_move();
    } 
    else move_audio.play();
  } else capture_audio.play();

}

/*main movement functions*/
function allow_drop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  const piece = ev.target;
  const color = piece.getAttribute("color");
  if ((turn && color == "white") || (!turn && color == "black")) {
    ev.dataTransfer.setData("text", piece.id);
  }
  show_legal_squares(piece);
}

function drop(ev) {
  hide_legal_squares();
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  if (!data) return;
  const piece = document.getElementById(data);
  const destination = ev.currentTarget;
  const destination_id = destination.id;
  const color = piece.getAttribute("color");

  if (!is_legal_move(piece, destination))
    return;

  move_piece(piece.square_id, destination_id, false);
 
}
/*setup*/
function init_board() {
  for (let i = 0; i < board_squares.length; i++) {
    board_squares[i].addEventListener("dragover", allow_drop);
    board_squares[i].addEventListener("drop", drop);
    let row = 8-Math.floor(i/8);
    let col = String.fromCharCode(97+(i%8));
    let current_square = board_squares[i];
    current_square.id = col+row;
  }
} 

function init_pieces() {
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener("dragstart", drag);
    pieces[i].setAttribute("draggable", true);
    pieces[i].square_id = pieces[i].parentElement.id;
    pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
    pieces[i].first_move = true;
    if (pieces[i].classList.contains("pawn")) pieces[i].en_passant = false;
  }
  for (let i = 0; i < piece_images.length; i++) {
    piece_images[i].setAttribute("draggable", false);
  }
}

async function reset_board() {
  $("#board").html(default_board);
  board_squares = document.getElementsByClassName("square");
  pieces = document.getElementsByClassName("piece");
  piece_images = document.getElementsByTagName("img");
  
  init_board();
  init_pieces();
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function play_board(moves, main_board) {
  await delay(500);
  for (let i = 0; i < moves.length; i = i+4) {
    let from = moves[i] + moves[i+1];
    let to = moves[i+2] + moves[i+3];
    move_piece(from, to, false);
    if (main_board) await delay(300);
  }
}

function undo_move() {
  let temp = history.slice(0, -4);
  reset_board();
  history = "";
  play_board(temp, false);
  //turn = !turn;
  clone_board();
  clone_pieces();
}

let temp = "";
//let temp = "f2f4e7e5e2e3f7f6f4e5g8h6e5f6f8b4f6g7d8e7"; //pawn promote
//let temp = "g2g4e7e6f2f3d7d5f1h3b8a6f3f4c7c6g1f3c8d7b1a3g8h6c2c3f8d6d2d3d8g5c1e3c6c5d1c2b7b6"; //castling

init_board();
init_pieces();
play_board(temp, true);
