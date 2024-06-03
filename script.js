function Game (p1Name = 'p1', p2Name = 'p2'){
    
    const player1 = new Player(p1Name,'X');
    const player2 = new Player(p2Name,'O'); 

    let currentPlayer = player1;
    let bRoundWon = false;
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
            console.log(`${row} ${col}`);
            console.log(gameBoard);
            console.log(gameBoard[row][col]);
            if (gameBoard[row][col] === '') return true;
            else return false;
        }
        
        return {gameBoard, addMarker, checkRows, checkColumns, 
            checkDiaganols, isValidMove, resetBoard};
    
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
            }
            else {
                console.log(`${currentPlayer.name} wins!`)
                roundWinner = currentPlayer.name;
                bRoundWon = true;
            }
        } else {
            console.log("Invalid move!");
        }
    }

    this.getRoundWon = function () {
        return bRoundWon;
    }

    this.resetRoundWon = function (){
        bRoundWon = false;
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

    this.checkForWinner = function () {
        if (board.checkColumns() ||
            board.checkRows() ||
            board.checkDiaganols()){
                return true;
            }
        else return false;
        
    };
}

function Player (name, marker){
    // contains info about the player
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
        const board = gameObj.getGameBoard();
        clearBoard();
        domPlayerTurn.textContent = `${gameObj.getCurrentPlayerName()}'s turn.`.toUpperCase();
        console.log(gameObj.getCurrentPlayerName());
        let rowIndex = 0;
        console.log('calling updateScreen')
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

            const brElem = document.createElement('br');
            domBoard.appendChild(brElem);
            rowIndex++;
        });
        if(gameObj.getRoundWon()){
            console.log("Round won, resetting")
            domPlayerTurn.textContent = `${gameObj.getRoundWinnerName()}'s wins!`.toUpperCase();
            disableBoardCells();
            addResetButton(board);
        } else {
            console.log("Round not won yet.")
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
        console.log(`Button count is ${buttonCount}`);

    }

    const addResetButton = () => {
        const resetButton = document.createElement('button');
        resetButton.textContent = "RESET";
        resetButton.className = "reset-button";
        resetButton.addEventListener("click", ()=>{
            resetGame();
            console.log(`bRoundWon is ${gameObj.getRoundWon()}`);
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
        console.log("calling clickStuff");
        const buttonId = event.currentTarget.getAttribute('id');
        let row = buttonId[0]
        let col = buttonId[2]
        console.log(event.currentTarget);
        
        gameObj.clickBoardCell(row, col);
        updateScreen();
    }

    function clearBoard (){
        domBoard.textContent = '';
    }

    function resetGame (){
        domPlayerTurn.textContent = "";
        // clearBoard();
        console.log(resetContainer.childElementCount);
        resetContainer.removeChild(resetContainer.lastChild);
        gameObj.resetGameBoard();
        gameObj.resetRoundWon();
        gameObj.resetCurrentPlayer();
        updateScreen();
    }

    initializeGame();

    // updateScreen();

}

DisplayController();