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
    ['b','b','b','b','b','b','b','b','b'],
    ['b','b','b','b','b','b','b','b','b'],
    ['b','b','b','b','b','b','b','b','b'],
    ['b','b','b','b','b','b','b','b','b'],
    ['b','b','b','b','b','b','b','b','b'],
    ['b','b','b','b','b','b','b','b','b'],
    ['b','b','b','b','b','b','b','b','b'],
    ['b','b','b','b','b','b','b','b','b'],
    ['b','b','b','b','b','b','b','b','b']
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

        document.getElementById("board").setAttribute('font-size', '70');
    }

    hoverPiece();
}   

module.exports = {vars};
