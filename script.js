function gameboard() {

    const rows = 3;
    const columns = 3;
    const boardArray = [];  

    // Create board, each cell is assigned a null token by default
    for (let i = 0; i < rows; i++) {
        boardArray[i] = []
        for (let j = 0; j < columns; j++) {
            boardArray[i][j] = null;
        }
    }

    return { boardArray, rows, columns }
}

function gameController(playerOneName="Player One", playerTwoName="Player Two") {
    const board = gameboard()
    const boardArray = board.boardArray;
    let gameState = undefined;

    const players = [
        {
          name: playerOneName,
          token: 1
        },
        {
          name: playerTwoName,
          token: 2
        }
      ];

    // Initialize activePlayer to player one
    let activePlayer = players[0];

    // Method for retrieving the active player
    const getActivePlayer = () => activePlayer;

    // Function for changing the active player
    function toggleActivePlayer() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    // Method for placing a token on the board
    function placeToken(row, column) {
        if (gameState === "win" || gameState === "draw") {
            return;
        }

        if (boardArray[row][column] === null) {
            boardArray[row][column] = activePlayer.token;
        } else {
            return console.log("This spot is already taken!");
        }

        switch (checkForWin()) {
            case 1:
                gameState = "win";
                break;
            case 2:
                gameState = "draw";
                break;
            default:
                toggleActivePlayer();
                printBoard();
                console.log(`${activePlayer.name}'s turn`)             
        }
    }

    // Function to check for a draw or a win
    function checkForWin() {

        let rowWin;
        let columnWin;
        let diagonalWin1 = true;
        let diagonalWin2 = true;
        let draw = true;

        for (let row = 0; row < board.rows; row++) {

            rowWin = true;
            columnWin = true;

            // Check a row win or a column win
            for (let column = 0; column < board.columns; column++) {
                if (boardArray[row][column] !== activePlayer.token) {
                    rowWin = false;
                }
                if (boardArray[column][row] !== activePlayer.token) {
                    columnWin = false;
                }
                if (draw === true && 
                    boardArray[row][column] !== players[0].token &&
                    boardArray[row][column] !== players[1].token) {
                        draw = false;
                    }
            }

            // Check diagonals for a win
            if (boardArray[row][row] !== activePlayer.token) {
                diagonalWin1 = false;
            }
            if (boardArray[row][board.columns - row - 1] !== activePlayer.token) {
                diagonalWin2 = false;
            }

            // Break loop if a row win or a column win
            if (rowWin === true || columnWin === true) {
                diagonalWin1 = false, diagonalWin2 = false;
                break;
            }
        }

        if (rowWin === true || columnWin === true || diagonalWin1 === true || diagonalWin2 === true) {
            console.log(`${activePlayer.name} WINS!`);
            return 1;
        }

        if (draw === true) {
            console.log(`DRAW!`);
            return 2;
        }
    }

    const resetGame = () => {
        gameState = undefined;
        activePlayer = players[0];

        for (let i = 0; i < board.rows; i++) {
            for (let j = 0; j < board.columns; j++) {
                boardArray[i][j] = null;
            }
        }
    }

    // Method for retrieving win condition
    const getGameState = () => gameState;
    
    // Method for printing the board to console
    const printBoard = () => console.log(boardArray);

    return { boardArray, getActivePlayer, placeToken, resetGame, gameState: getGameState, printBoard }
}

function displayController() {
    // to do
    const game = gameController();

    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resetButton = document.querySelector("#reset-button");

    resetButton.addEventListener("click", () => {
        game.resetGame();
        updateScreen();
    });

    const updateScreen = () => {
        // Clear board
        boardDiv.textContent = "";
    
        // Get the newest version of the board and player turn
        const boardArray = game.boardArray;
        const activePlayer = game.getActivePlayer();
    
        // Display game state
        if (game.gameState() === "win") {
            playerTurnDiv.textContent = `${activePlayer.name} wins!`;
        } else if (game.gameState() === "draw") {
            playerTurnDiv.textContent = `It's a draw!`;
        } else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`; 
        }

        // Render board squares
        boardArray.forEach((row, rowIndex) => {
            row.forEach((token, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex
                cellButton.dataset.column = columnIndex
                cellButton.textContent = token;
                boardDiv.appendChild(cellButton);
            })
        });
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // Make sure a column is clicked
        if (!selectedColumn) return;

        game.placeToken(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();
}

displayController();