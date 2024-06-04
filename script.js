function Game (p1Name = 'p1', p2Name = 'p2'){
    
    const player1 = new Player(p1Name,'X');
    const player2 = new Player(p2Name,'O'); 

    let currentPlayer = player1;
    let roundState = "playing";
    let roundWinner;
    

    const board = (function () {
    
        // contains array of the game board
        let gameBoard = [
            ['','',''],
            ['','',''],
            ['','','']
        ];

        const resetBoard = () => {
            for (let i = 0; i < 3; i++){
                for (let j = 0; j < 3 ; j++){
                    gameBoard[i][j] = '';
                }
            }

            console.log(gameBoard);
        }
    
        const addMarker = (row, col, marker) => {
            console.log("adding marker");
    
            if(!isValidMove(row, col)){
                console.log("Invalid placement!");
                return false;
            } else {
                gameBoard[row][col] = marker;
                return true;
            }
        };

        const checkTie = () => {
            let emptyCells = Array();
            for(let i = 0; i < 3; i++){
                for (let j = 0; j < 3; j++){
                    if (gameBoard[i][j] === ''){
                        emptyCells.push(gameBoard[i][j]);
                    }
                }
            }

            console.log(emptyCells);
            console.log("empty cells length: " + emptyCells.length);
            if(emptyCells.length !== 0){
                return false;
            } else return true;

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
    
        const isValidMove = (row, col) => {
            console.log('isValidMove');
            console.log(gameBoard);
            if (gameBoard[row][col] === '') return true;
            else return false;
        }
        
        return {gameBoard, addMarker, checkRows, checkColumns, 
            checkDiaganols, isValidMove, resetBoard, checkTie};
    
    })();

    this.setPlayerNames = function (p1,p2) {
        player1.name = p1;
        player2.name = p2;
    }

    this.getCurrentPlayerName = function (){
        return currentPlayer.name;
    }
    
    this.getRoundWinnerName = function () {
        return roundWinner;
    }

    this.mainLoop = function (){
        do{
            this.takeTurn();
            this.switchPlayer();
        } while (!this.checkForWinner())

        console.log("Game over!")
        // needs to say who winner is
    }

    this.clickBoardCell = function (row,col){
        if(board.isValidMove(row, col)){
            board.addMarker(row,col, currentPlayer.marker);
            if(!this.checkForWinner()){
                this.switchPlayer();
                if (board.checkTie()){
                    console.log("tie game!")
                    roundState = "tie";
                }
            }
            else {
                console.log(`${currentPlayer.name} wins!`)
                roundWinner = currentPlayer.name;
                roundState = "won";
            }
        } else {
            console.log("Invalid move!");
        }
    }

    this.getRoundState = function () {
        return roundState;
    }

    this.resetRoundState = function (){
        roundState = "playing";
        roundWinner = undefined;
    }

    this.getGameBoard = function (){
        console.log("retrieving game board");
        return board.gameBoard;
    }

    this.resetGameBoard = function (){
        console.log("Reseting the game board");
        board.resetBoard();
        console.log(board.gameBoard)
    }

    this.resetCurrentPlayer = function (){
        console.log("resetting currentPlayer");
        currentPlayer = player1;
        console.log(`Name is ${currentPlayer.name} marker is ${currentPlayer.marker}`);
    }
    
    this.checkForWinner = function () {
        if (board.checkColumns() ||
            board.checkRows() ||
            board.checkDiaganols()){
                return true;
            }
        else return false;
    };
    
    this.takeTurn = function (){
        let moves;

        do {
            moves = this.getPlayerMove();
        } while(!board.isValidMove(moves[0], moves[1]))

        board.addMarker(moves[0], moves[1], currentPlayer.marker);
        this.printBoard();
    };

    this.getPlayerMove = function(){
        let playerMove = prompt(`${currentPlayer.name}, make your move:`)
        return [playerMove[0], playerMove[1]];
    };
    
    this.switchPlayer = function (){
        switch(currentPlayer){
            case player1:
                currentPlayer = player2;
                break;
            case player2:
                currentPlayer = player1;
                break;
        }
    };

    this.printBoard = function () {
        console.log(board.gameBoard[0]);
        console.log(board.gameBoard[1]);
        console.log(board.gameBoard[2]);
    };

}

function Player (name, marker){
    this.name = name;
    this.marker = marker;
}

function DisplayController () {
    const gameObj = new Game();
    const domBoard = document.querySelector('.board');
    const domPlayerTurn = document.querySelector('.player-turn');
    const dialog = document.querySelector('dialog');
    const dialogSubmit = document.querySelector(".dialog-submit-names");
    const resetContainer = document.querySelector(".reset-container")
    
    const initializeGame = () => {
        dialog.showModal();
        console.log(dialogSubmit.value)
        dialogSubmit.addEventListener('click', ()=>{
            const p1 = document.querySelector("#p1_name");
            const p2 = document.querySelector("#p2_name");
            gameObj.setPlayerNames(p1.value, p2.value);
            dialog.close();
            updateScreen();
        });
    }

    const updateScreen = () => {
        console.log('calling updateScreen')
        const board = gameObj.getGameBoard();
        clearBoard();
        domPlayerTurn.textContent = `${gameObj.getCurrentPlayerName()}'s turn.`.toUpperCase();
        let rowIndex = 0;
        board.forEach(row => {
            let colIndex = 0;
            row.forEach(cell => {
                const boardCell = document.createElement('button');
                boardCell.id = `${rowIndex} ${colIndex}`;
                boardCell.className = "board-cell";
                boardCell.textContent = cell;
                
                addClickEvent(boardCell);
                domBoard.appendChild(boardCell);
                colIndex++;
            });
            rowIndex++;
        });
        if(gameObj.getRoundState() === "won"){
            console.log("Round won, resetting")
            domPlayerTurn.textContent = `${gameObj.getRoundWinnerName()}'s wins!`.toUpperCase();
            disableBoardCells();
            addResetButton(board);
        } else if (gameObj.getRoundState() === "tie") {
            domPlayerTurn.textContent = `TIE GAME`;
            disableBoardCells();
            addResetButton(board);
        }
         else {
            console.log("Still playing.")
        }

    }

    const disableBoardCells = () => {
        const boardChildren = domBoard.childNodes;
        let buttonCount = 0;
        boardChildren.forEach((node)=>{
            if (node.nodeName === "BUTTON") {
                buttonCount++;
                node.removeEventListener('click', clickStuff);
            }
        });
    }

    const addResetButton = () => {
        const resetButton = document.createElement('button');
        resetButton.textContent = "RESET";
        resetButton.className = "reset-button";
        resetButton.addEventListener("click", ()=>{
            resetGame();
            console.log(`roundState is ${gameObj.getRoundState()}`);
        });
        if (resetContainer.childNodes.length !== 0){
            resetContainer.removeChild(resetContainer.lastChild);
        } else {
            resetContainer.appendChild(resetButton);
        }
    }

    const addClickEvent = (button) => {
        button.addEventListener('click', clickStuff);
    }


    function clickStuff (event) {
        const buttonId = event.currentTarget.getAttribute('id');
        let row = buttonId[0]
        let col = buttonId[2]
        gameObj.clickBoardCell(row, col);
        updateScreen();
    }

    function clearBoard (){
        domBoard.textContent = '';
    }

    function resetGame (){
        domPlayerTurn.textContent = "";
        resetContainer.removeChild(resetContainer.lastChild);
        gameObj.resetGameBoard();
        gameObj.resetRoundState();
        gameObj.resetCurrentPlayer();
        updateScreen();
    }

    initializeGame();

}

DisplayController();