function gameboard() {

    const rows = 3;
    const columns = 3;
    const board = [];  

    // Create board, each cell is assigned a null token by default
    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i][j] = null;
        }
    }

    // Method for getting board
    const getBoard = () => board ;

    return { getBoard, rows, columns }
}

function gameController(playerOneName="Player One", playerTwoName="Player Two") {
    const board = gameboard()
    const boardArray = board.getBoard();

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
        if (boardArray[row][column] === null) {
            boardArray[row][column] = activePlayer.token;
        } else {
            return console.log("This spot is already taken!");
        }
        checkForWin();
        toggleActivePlayer();
        printBoard();
        console.log(`${activePlayer.name}'s turn`)
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
            return console.log(`${activePlayer.name} WINS!`);
        }

        if (draw === true) {
            return console.log(`DRAW!`);
        }
    }
    
    // Method for printing the board to console
    const printBoard = () => console.log(boardArray);

    return { getActivePlayer, placeToken, printBoard }
}

function displayController() {
    // to do
}