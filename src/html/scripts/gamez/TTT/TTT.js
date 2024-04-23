//Sets global variable, allows access for variables within other functions
let vars = {};

//Sets default values for variables
vars.pieceSVG = 'X';
vars.color1 = 'red';
vars.color2 = 'blue';
vars.hoverColor1 = 'pink';
vars.hoverColor2 = 'powderblue';
vars.pieceColor = vars.color1;
vars.pieceHoverColor = vars.hoverColor1;
vars.count = 0;

//Sets array for Tic-Tac-Toe
vars.board = [
    ['b','b','b'],
    ['b','b','b'],
    ['b','b','b']
];

//Sets array for Tic-Tac-Toe²
vars.board2 = [
    ['b','b','b'],
    ['b','b','b'],
    ['b','b','b']
];

//Button functionality for selecting Tic-Tac-Toe
function selectTTT() {
    var startScreen = document.getElementById("startScreen");

    startScreen.style.display = 'none';

    vars.gameType = 1;
    drawBoard();
}

//Button functionality for Tic-Tac-Toe²
function selectTTT2() {
    var startScreen = document.getElementById("startScreen");

    startScreen.style.display = 'none';

    vars.gameType = 2;
    drawBoard();
}

//Draws the game board
function drawBoard() {
    let boardCode = '<line x1="0" y1="180" x2="540" y2="180" style="fill:none;stroke:black;stroke-width:5"/>'
        + '<line x1="0" y1="360" x2="540" y2="360" style="fill:none;stroke:black;stroke-width:5"/>'
        + '<line x1="180" y1="0" x2="180" y2="540" style="fill:none;stroke:black;stroke-width:5"/>'
        + '<line x1="360" y1="0" x2="360" y2="540" style="fill:none;stroke:black;stroke-width:5"/>'
        + '<text id="pieceHover"></text>';
    if (vars.gameType == 2) {
        boardCode += '<line x1="0" y1="60" x2="540" y2="60" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="0" y1="120" x2="540" y2="120" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="0" y1="240" x2="540" y2="240" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="0" y1="300" x2="540" y2="300" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="0" y1="420" x2="540" y2="420" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="0" y1="480" x2="540" y2="480" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="60" y1="0" x2="60" y2="540" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="120" y1="0" x2="120" y2="540" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="240" y1="0" x2="240" y2="540" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="300" y1="0" x2="300" y2="540" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="420" y1="0" x2="420" y2="540" style="fill:none;stroke:black;stroke-width:1"/>'
            + '<line x1="480" y1="0" x2="480" y2="540" style="fill:none;stroke:black;stroke-width:1"/>';
    }
    document.getElementById("board").innerHTML = boardCode;
}

//Event on mouse move
function coordinate(event) {
    let x = event.clientX;
    let y = event.clientY;
    let divElement = document.getElementById("board");
    let rect = divElement.getBoundingClientRect();

    if (vars.gameType == 1) {
        let arrayX = (x - rect.left) / 180;
        let arrayY = (y - rect.top) / 180;
        vars.arrayX = Math.floor(arrayX);
        vars.arrayY = Math.floor(arrayY);

        vars.pieceX = (vars.arrayX * 180) + 63;
        vars.pieceY = (vars.arrayY * 180) + 120;
    } else {
        let arrayX = (x - rect.left) / 60;
        let arrayY = (y - rect.top) / 60;
        vars.arrayX = Math.floor(arrayX);
        vars.arrayY = Math.floor(arrayY);

        vars.pieceX = (vars.arrayX * 60);
        vars.pieceY = (vars.arrayY * 60) + 60;
    }

    hoverPiece();
}   

//Draws the piece when hovering over space
function hoverPiece() {
    if (vars.gameType == 1) {
        if (isLegal()) {
            document.getElementById("pieceHover").setAttribute('x', vars.pieceX);
            document.getElementById("pieceHover").setAttribute('y', vars.pieceY);
            document.getElementById("pieceHover").setAttribute('fill', vars.pieceHoverColor);
            document.getElementById("pieceHover").innerHTML = vars.pieceSVG;
        }
    } else {
        document.getElementById("pieceHover").setAttribute('x', vars.pieceX);
        document.getElementById("pieceHover").setAttribute('y', vars.pieceY);
        document.getElementById("pieceHover").setAttribute('fill', vars.pieceHoverColor);
        document.getElementById("pieceHover").innerHTML = vars.pieceSVG;
    }
    
}

//Draws the piece
function drawPiece() {
    let pieceCode = '<text x="' + vars.pieceX + '" y="' + vars.pieceY + '" fill="' + vars.pieceColor + '">' + vars.pieceSVG + '</text>';
    document.getElementById("board").insertAdjacentHTML("beforeend",pieceCode);
}

//Performs functions when clicking
function onClick() {
    if (isLegal()) {
        drawPiece();
        setArray();
        if (!isWin()) {
            pieceType();
            isFull();
        }
    }
}

//Determines if board if full
function isFull() {
    vars.count += 1;
    if (vars.count == 9) {
        let drawCode = '<text x="170" y="270" fill="black">Draw!</text>';
        
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
    vars.board[vars.arrayX][vars.arrayY] = vars.pieceSVG;
}

//Determines if move is legal
function isLegal() {
    return Boolean(vars.board[vars.arrayX][vars.arrayY] == 'b' && !isWin());
}

//Erases board and says winner
function drawWin() {
    let winCode = '<text x="140" y="270" fill="' + vars.pieceColor + '">' + vars.winPiece + ' Wins!</text>';
        
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