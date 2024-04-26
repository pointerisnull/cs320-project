let {vars} = require('./TTT_initiate.js');

//Determines if board if full
function isFull() {
    vars.count += 1;
    if (vars.count == 9) {
        let drawCode = '<text x="170" y="270" fill="black" font-size="80">Draw!</text>';
        
        document.getElementById("board").innerHTML = drawCode;
    }
}

//Swaps the piece type after turns
function pieceType() {
    if (vars.pieceSVG == 'X') {
        vars.pieceSVG = 'O';
        vars.pieceColor = vars.color2;
        vars.pieceHoverColor = vars.hoverColor2;
    } else {
        vars.pieceSVG = 'X';
        vars.pieceColor = vars.color1;
        vars.pieceHoverColor = vars.hoverColor1;
    }
}

//Changes array value
function setArray() {
    if (vars.gameType == 1) {
        vars.board[vars.arrayX][vars.arrayY] = vars.pieceSVG;
    } else {
        vars.board2[vars.arrayX][vars.arrayY] = vars.pieceSVG;
    }
}

//Determines if move is legal
function isLegal() {
    if (vars.gameType == 1) {
        return Boolean(vars.board[vars.arrayX][vars.arrayY] == 'b' && !isWin());
    } else {
        return Boolean(vars.board2[vars.arrayX][vars.arrayY] == 'b' && !isWin());
    }
    
}

//Erases board and says winner
function drawWin() {
    let winCode = '<text x="140" y="270" fill="' + vars.pieceColor + '" font-size="80">' + vars.winPiece + ' Wins!</text>';
        
    document.getElementById("board").innerHTML = winCode;
}

//Determines if win 
function isWin() {
    if (vars.board[0][0] == vars.board[0][1] && vars.board[0][1] == vars.board[0][2] && vars.board[0][2] != 'b') {
        vars.winPiece = vars.pieceSVG;
        drawWin();
        return true;
    } else if (vars.board[1][0] == vars.board[1][1] && vars.board[1][1] == vars.board[1][2] && vars.board[1][2] != 'b') {
        vars.winPiece = vars.pieceSVG;
        drawWin();
        return true;
    } else if (vars.board[2][0] == vars.board[2][1] && vars.board[2][1] == vars.board[2][2] && vars.board[2][2] != 'b') {
        vars.winPiece = vars.pieceSVG;
        drawWin();
        return true;
    } else if (vars.board[0][0] == vars.board[1][0] && vars.board[1][0] == vars.board[2][0] && vars.board[2][0] != 'b') {
        vars.winPiece = vars.pieceSVG;
        drawWin();
        return true;
    } else if (vars.board[0][1] == vars.board[1][1] && vars.board[1][1] == vars.board[2][1] && vars.board[2][1] != 'b') {
        vars.winPiece = vars.pieceSVG;
        drawWin();
        return true;
    } else if (vars.board[0][2] == vars.board[1][2] && vars.board[1][2] == vars.board[2][2] && vars.board[2][2] != 'b') {
        vars.winPiece = vars.pieceSVG;
        drawWin();
        return true;
    } else if (vars.board[0][0] == vars.board[1][1] && vars.board[1][1] == vars.board[2][2] && vars.board[2][2] != 'b') {
        vars.winPiece = vars.pieceSVG;
        drawWin();
        return true;
    } else if (vars.board[2][0] == vars.board[1][1] && vars.board[1][1] == vars.board[0][2] && vars.board[0][2] != 'b') {
        vars.winPiece = vars.pieceSVG;
        drawWin();
        return true;
    } else {
        return false;
    }
}
