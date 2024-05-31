// game board object
// contains Gameboard array of the board

// object to control the flow of the game => game object

// player object

// DOM/display handler object


// *** GAME OBJECT **
//
// control the flow of the game
//
// Functions:
// create the board state
// get player input
// set up and create the players

function Game (){

    // 
    // Fn: setup game
    // create players
    const player1 = new Player('p1','X');
    const player2 = new Player('p2','O');
    // would prompt the user in the browser somehow
    
    // set which player currently has their turn
    let currentPlayer = player1;

    // create Gameboard
    const board = (function () {

        // contains array of the game board
        const gameBoard = [
            ['','',''],
            ['','',''],
            ['','','']
        ]

        const addMarker = (row, col, marker) => {
            console.log("adding marker");
            gameBoard[row][col] = marker;
            console.log(gameBoard);
        };

        const checkRows = () => {
            for (let i = 0; i < 3; i++){
                let firstSymbol = gameBoard[i][0];
                
                if (firstSymbol === gameBoard[i][1] &&
                    firstSymbol === gameBoard[i][2] &&
                    firstSymbol !== ''
                ) return true;

            }

            return false;
        };

        const checkColumns = () => {
            for (let i = 0; i < 3; i++){
                let firstSymbol = gameBoard[0][i];
                
                if (firstSymbol === gameBoard[1][i] &&
                    firstSymbol === gameBoard[2][i] &&
                    firstSymbol !== ''
                ) return true;

            }

            return false;
        };

        const checkDiaganols = () => {
            // check 0,0 diag:
            let firstSymbol = gameBoard[0][0];
            if (firstSymbol !== '' &&
                firstSymbol === gameBoard[1][1] &&
                firstSymbol === gameBoard[2][2]
            ) return true;

            firstSymbol = gameBoard[0][2];
            if (firstSymbol !== '' &&
                firstSymbol === gameBoard[1][1] &&
                firstSymbol === gameBoard[2][0]
            ) return true;

            return false;
        };
        
        return {gameBoard, addMarker, checkRows, checkColumns, 
            checkDiaganols};
    
    })();

    this.printBoard = function () {
        console.log(board);
    };

    this.checkForWinner = function () {
        if (board.checkColumns() ||
            board.checkRows() ||
            board.checkDiaganols()){
                return true;
            }
        else return false;
        
    };
    
    board.addMarker(0,0,"O");
    board.addMarker(0,1,"X");
    board.addMarker(0,2,"O");

    board.addMarker(1,0,"X");
    board.addMarker(1,1,"X");
    board.addMarker(1,2,"O");

    board.addMarker(2,0,"O");
    board.addMarker(2,1,"O");
    board.addMarker(2,2,"X");

    console.log(this.checkForWinner());

}

function Player (name, marker){
    // contains info about the player
    this.name = name;
    this.marker = marker;
}


const gameObj = new Game();

// gameObj.printBoard();