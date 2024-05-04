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
vars.gameStart = 1;

//Sets array for Tic-Tac-Toe
vars.board = [
    ['b','b','b'],
    ['b','b','b'],
    ['b','b','b']
];

//Sets array for Tic-Tac-Toe²
vars.board2 = [
    ['','',''],
    ['','',''],
    ['','','']
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
    initBoard2();
    drawBoard();
}

//Sets vars.board2 as an array of vars.board objects
function initBoard2() {
    for (let i = 0;i < 3;i++) {
        for (let j = 0;j < 3;j++) {
            window['vars.board' + i + j] = JSON.parse(JSON.stringify(vars.board));
            vars.board2[i][j] = [...window['vars.board' + i + j]];
            console.log(window['vars.board' + i + j]);
            //vars.board2[i][j][0][0] = 'O';
        }
    }
    console.log(vars.board2[0][0][0][0]);
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

        vars.pieceX = (vars.arrayX * 180) + 25;
        vars.pieceY = (vars.arrayY * 180) + 160;
        
        document.getElementById("board").setAttribute('font-size', '180');
    } else {
        let arrayX = (x - rect.left) / 60;
        let arrayY = (y - rect.top) / 60;
        vars.arrayX = Math.floor(arrayX);
        vars.arrayY = Math.floor(arrayY);

        vars.pieceX = (vars.arrayX * 60) + 5;
        vars.pieceY = (vars.arrayY * 60) + 55;

        let arrayX2 = vars.arrayX / 3;
        let arrayY2 = vars.arrayY / 3;
        vars.arrayX2 = Math.floor(arrayX2);
        vars.arrayY2 = Math.floor(arrayY2);
        
        vars.arrayX = vars.arrayX - (3 * vars.arrayX2);
        vars.arrayY = vars.arrayY - (3 * vars.arrayY2);

        document.getElementById("board").setAttribute('font-size', '70');

        
    }

    document.getElementById("gameType").value = vars.gameType;
    document.getElementById("X").value = vars.arrayX;
    document.getElementById("Y").value = vars.arrayY;
    document.getElementById("gameX").value = vars.arrayX2;
    document.getElementById("gameY").value = vars.arrayY2;
    document.getElementById("arrayValue").value = vars.board2[vars.arrayX2][vars.arrayY2][vars.arrayX][vars.arrayY];
    document.getElementById("arrayTrue").value = isLegal();

    hoverPiece();
}   

//Draws the piece when hovering over space
function hoverPiece() {
    if (isLegal()) {
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
        vars.tempArrX = vars.arrayX;
        vars.tempArrY = vars.arrayY;
        if (!isWin()) {
            pieceType();
            if (vars.gameType == 1) {
                isFull();
            }
        }
        vars.gameStart = 0;
    }
    console.log(vars.board2[vars.arrayX2][vars.arrayY2][vars.arrayX][vars.arrayY]);
    console.log(vars.board2);
}

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
        //vars.board2[0][0][vars.arrayX][vars.arrayY] = 'O';
        vars.board2[vars.arrayX2][vars.arrayY2][vars.arrayY][vars.arrayX] = vars.pieceSVG;
    }
}

//Determines if move is legal
function isLegal() {
    if (vars.gameType == 1) {
        return Boolean(vars.board[vars.arrayX][vars.arrayY] == 'b' && !isWin());
    } else {
        isOpenSpace = Boolean(vars.board2[vars.arrayX2][vars.arrayY2][vars.arrayY][vars.arrayX] == 'b');
        if (vars.gameStart != 0 || (vars.board2[vars.tempArrX][vars.tempArrY] != 'X' && vars.board2[vars.tempArrX][vars.tempArrY] != 'O')) {
            isMatchingGame = Boolean(vars.arrayX2 == vars.tempArrX && vars.arrayY2 == vars.tempArrY);
            legalMove = Boolean((isOpenSpace && isMatchingGame) || vars.gameStart != 0);
        } else {
            legalMove = Boolean(isOpenSpace);
        }
        return Boolean(legalMove);
    }
    
}

//Erases board and says winner
function drawWin() {
    let winCode = '<text x="140" y="270" fill="' + vars.pieceColor + '" font-size="80">' + vars.winPiece + ' Wins!</text>';
        
    document.getElementById("board").innerHTML = winCode;
}

//Determines if win 
function isWin() {
    if (vars.gameType == 1) {
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
        }
    } else {
        if (vars.board2[vars.arrayX2][vars.arrayY2][0][0] == vars.board2[vars.arrayX2][vars.arrayY2][0][1] && vars.board2[vars.arrayX2][vars.arrayY2][0][1] == vars.board2[vars.arrayX2][vars.arrayY2][0][2] && vars.board2[vars.arrayX2][vars.arrayY2][0][2] != 'b') {
            vars.board2[vars.arrayX2][vars.arrayY2] = vars.pieceSVG;
            return true;
        } else if (vars.board2[vars.arrayX2][vars.arrayY2][1][0] == vars.board2[vars.arrayX2][vars.arrayY2][1][1] && vars.board2[vars.arrayX2][vars.arrayY2][1][1] == vars.board2[vars.arrayX2][vars.arrayY2][1][2] && vars.board2[vars.arrayX2][vars.arrayY2][1][2] != 'b') {
            vars.board2[vars.arrayX2][vars.arrayY2] = vars.pieceSVG;
            return true;
        } else if (vars.board2[vars.arrayX2][vars.arrayY2][2][0] == vars.board2[vars.arrayX2][vars.arrayY2][2][1] && vars.board2[vars.arrayX2][vars.arrayY2][2][1] == vars.board2[vars.arrayX2][vars.arrayY2][2][2] && vars.board2[vars.arrayX2][vars.arrayY2][2][2] != 'b') {
            vars.board2[vars.arrayX2][vars.arrayY2] = vars.pieceSVG;
            return true;
        } else if (vars.board2[vars.arrayX2][vars.arrayY2][0][0] == vars.board2[vars.arrayX2][vars.arrayY2][1][0] && vars.board2[vars.arrayX2][vars.arrayY2][1][0] == vars.board2[vars.arrayX2][vars.arrayY2][2][0] && vars.board2[vars.arrayX2][vars.arrayY2][2][0] != 'b') {
            vars.board2[vars.arrayX2][vars.arrayY2] = vars.pieceSVG;
            return true;
        } else if (vars.board2[vars.arrayX2][vars.arrayY2][0][1] == vars.board2[vars.arrayX2][vars.arrayY2][1][1] && vars.board2[vars.arrayX2][vars.arrayY2][1][1] == vars.board2[vars.arrayX2][vars.arrayY2][2][1] && vars.board2[vars.arrayX2][vars.arrayY2][2][1] != 'b') {
            vars.board2[vars.arrayX2][vars.arrayY2] = vars.pieceSVG;
            return true;
        } else if (vars.board2[vars.arrayX2][vars.arrayY2][0][2] == vars.board2[vars.arrayX2][vars.arrayY2][1][2] && vars.board2[vars.arrayX2][vars.arrayY2][1][2] == vars.board2[vars.arrayX2][vars.arrayY2][2][2] && vars.board2[vars.arrayX2][vars.arrayY2][2][2] != 'b') {
            vars.board2[vars.arrayX2][vars.arrayY2] = vars.pieceSVG;
            return true;
        } else if (vars.board2[vars.arrayX2][vars.arrayY2][0][0] == vars.board2[vars.arrayX2][vars.arrayY2][1][1] && vars.board2[vars.arrayX2][vars.arrayY2][1][1] == vars.board2[vars.arrayX2][vars.arrayY2][2][2] && vars.board2[vars.arrayX2][vars.arrayY2][2][2] != 'b') {
            vars.board2[vars.arrayX2][vars.arrayY2] = vars.pieceSVG;
            return true;
        } else if (vars.board2[vars.arrayX2][vars.arrayY2][2][0] == vars.board2[vars.arrayX2][vars.arrayY2][1][1] && vars.board2[vars.arrayX2][vars.arrayY2][1][1] == vars.board2[vars.arrayX2][vars.arrayY2][0][2] && vars.board2[vars.arrayX2][vars.arrayY2][0][2] != 'b') {
            vars.board2[vars.arrayX2][vars.arrayY2] = vars.pieceSVG;
            return true;
        }
    }
    
    return false;
}