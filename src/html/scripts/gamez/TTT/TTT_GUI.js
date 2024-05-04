let {vars} = require('./TTT_initiate.js');

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

//Draws the piece when hovering over space
function hoverPiece() {
    if (isLegal()) {
        if (vars.gameType == 1) {
            document.getElementById("pieceHover").setAttribute('x', vars.pieceX);
            document.getElementById("pieceHover").setAttribute('y', vars.pieceY);
            document.getElementById("pieceHover").setAttribute('fill', vars.pieceHoverColor);
            document.getElementById("pieceHover").innerHTML = vars.pieceSVG;
        } else {
            document.getElementById("pieceHover").setAttribute('x', vars.pieceX);
            document.getElementById("pieceHover").setAttribute('y', vars.pieceY);
            document.getElementById("pieceHover").setAttribute('fill', vars.pieceHoverColor);
            document.getElementById("pieceHover").innerHTML = vars.pieceSVG;
        }
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
            if (vars.gameType == 1) {
                isFull();
            }
        }
    }
}
