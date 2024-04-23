let captured_pieces = [];
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

function check_coords(col, row) {
  const char_col = String.fromCharCode(col+96);
  const char_row = row.toString();
  const coords = char_col + char_row;
  let square;
  for (let i = 0; i < board_squares.length; i++) {
    if (board_squares[i].id == coords)
      square = board_squares[i];
  }
  console.log(square);

  return is_occupied(square);
}

function is_check() {
  /*TODO*/
  return false;
}

function pawn_promote(pawn) {
/*TODO*/
}
/*piece legality*/
function pawn_legality(pawn, fcol, frow, tocol, torow, occupation, color) {
  /*first move, pawn can move foward 2 spaces (optional)*/ 
  if (pawn.first_move) {
    pawn.fist_move = false;
    /*ONLY returns if moving two spaces foward*/
    if (color == "white") {
      if ((torow - frow == 1 || torow - frow == 2) && tocol == fcol && occupation == "empty")
        return true;
    } else if (color == "black") {
      if ((frow-torow == 1 || frow - torow == 2) &&  tocol == fcol && occupation == "empty") {
        return true;
      }
    }
  }
  /*normal case*/
  if (color == "white") {
    if ((torow-frow == 1) && tocol == fcol && occupation == "empty")
      return true;
  } else if(color == "black") {
    if ((frow-torow == 1) &&  tocol == fcol && occupation == "empty")
      return true;
  }
  /*attacking*/
  if (color == "white") {
    if ((torow-frow == 1) && (tocol+1 == fcol || tocol-1 == fcol) && occupation != "empty" && occupation != color)
      return true;
  }else if (color == "black") {
    if ((frow-torow == 1) &&  (tocol+1 == fcol || tocol-1 == fcol) && occupation != "empty" && occupation != color)
      return true;
  }
  return false;
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
      console.log("here");
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

      console.log("here");
      if(occupation != "empty" && occupation == color) return false;
      return true;
    }
    return false;
}


function bishop_legality(piece, fcol, frow, tocol, torow, occupation, color) {
//north east
    if(tocol > fcol && torow < frow) {
      var cdist = tocol - fcol;
      var rdist = frow - torow;
      if(cdist == rdist) {
        if(color == occupation) return false;

      } else return false;

      return true;
    }
    //north west
    if(fcol > tocol && torow < frow) {
      var cdist = fcol - tocol;
      var rdist = frow - torow;
      if(cdist == rdist) {
        if(color == occupation) return false;

      } else return false;
      return true;
    }   
    //south east
    if(tocol > fcol && torow > frow) {
      var cdist = tocol - fcol;
      var rdist = torow - frow;
      if(cdist == rdist) {
        if(color == occupation) return false;

      } else return false;
 
      return true;
    }

    //south west
    if(fcol > tocol && torow > frow) {
      var cdist = fcol - tocol;
      var rdist = torow - frow;
      if(cdist == rdist) {
        if(color == occupation) return false;

      } else return false;
     
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
  if(color != occupation) {
  //vertical
    if(tocol == fcol) 
      if(Math.abs(torow-frow) == 1) return true;
      //horizontal
    if(torow == frow) 
      if(Math.abs(tocol-fcol) == 1) return true;
    //diagonal
    if(Math.abs(tocol-fcol)==1 && Math.abs(frow-torow)==1) return true;
  }
  return false;
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
}

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  if (!data) return;
  const piece = document.getElementById(data);
  const destination = ev.currentTarget;
  const destination_id = destination.id;
  const color = piece.getAttribute("color");

  if (!is_legal_move(piece, destination))
    return;

  if (is_occupied(destination) == "empty") {
    destination.appendChild(piece);
    turn = !turn;
  } else {
    /*capture enemy pieces and prevent self-capture*/
    if (turn == true && color == "white" && is_occupied(destination) == "black") {
      /*destroy all children then append piece*/
      while(destination.firstChild) {
        /*console.log(destination.firstChild);
        let child = destination.firstChild.getAttribute("class");
        captured_pieces.push(child);*/
        destination.removeChild(destination.firstChild);
      }
      destination.appendChild(piece);
      turn = !turn;
    } else if (turn == false && color == "black" && is_occupied(destination) == "white") {
      /*destroy all children then append piece*/
      while(destination.firstChild) {
        /*console.log(destination);
        let child = destination.firstChild.getAttribute("class");
        captured_pieces.push(child);*/
        destination.removeChild(destination.firstChild);
      } 
      destination.appendChild(piece);
      turn = !turn;
    }
  }
  /*update the piece's coordinates*/
  piece.first_move = false;
  piece.square_id = destination_id;
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
  }
  for (let i = 0; i < piece_images.length; i++) {
    piece_images[i].setAttribute("draggable", false);
  }
}

init_board();
init_pieces();
