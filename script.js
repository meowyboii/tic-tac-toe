const gameManager = (function () {
  //If current turn is true, then it is player 1's turn
  let currentTurn = true;
  const getCurrentTurn = () => currentTurn;
  const toggleCurrentTurn = () => {
    currentTurn = !currentTurn;
  };

  let gameEnded = false;
  const getGameEnded = () => gameEnded;
  const toggleGameEnded = () => {
    gameEnded = !gameEnded;
  };

  let numberOfTurns = 9;
  const getNumberOfTurns = () => numberOfTurns;
  const reduceNumberOfTurns = () => numberOfTurns--;

  const getWinner = () => {
    if (numberOfTurns == 0) {
      return "no one! It's a draw!";
    }
    if (currentTurn) {
      return "Player 1";
    } else {
      return "Player 2";
    }
  };
  return {
    getCurrentTurn,
    toggleCurrentTurn,
    getGameEnded,
    toggleGameEnded,
    getWinner,
    getNumberOfTurns,
    reduceNumberOfTurns,
  };
})();

const gameBoard = (function () {
  let gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const updateGameBoard = (row, col) => {
    if (gameManager.getCurrentTurn()) {
      gameBoard[row][col] = "X";
    } else {
      gameBoard[row][col] = "O";
    }
    gameManager.reduceNumberOfTurns();
    console.log(gameBoard);
  };

  const checkWinner = () => {
    let symbol = "";
    if (gameManager.getCurrentTurn()) {
      symbol = "X";
    } else {
      symbol = "O";
    }
    //Check rows
    for (let i = 0; i < 3; i++) {
      if (
        gameBoard[i][0] === symbol &&
        gameBoard[i][1] === symbol &&
        gameBoard[i][2] === symbol
      ) {
        console.log("ROWS");
        return true;
      }
    }
    //Check columns
    for (let i = 0; i < 3; i++) {
      if (
        gameBoard[0][i] === symbol &&
        gameBoard[1][i] === symbol &&
        gameBoard[2][i] === symbol
      ) {
        console.log("COLUMNS");
        return true;
      }
    }
    //Check diagonals
    if (
      gameBoard[0][0] === symbol &&
      gameBoard[1][1] === symbol &&
      gameBoard[2][2] === symbol
    ) {
      console.log("DIAGONAL1");
      return true;
    }
    if (
      gameBoard[0][2] === symbol &&
      gameBoard[1][1] === symbol &&
      gameBoard[2][0] === symbol
    ) {
      console.log("DIAGONAL2", symbol);
      return true;
    }
    if (gameManager.getNumberOfTurns() === 0) {
      return true;
    }
    return false;
  };
  return { updateGameBoard, checkWinner };
})();

const boards = document.querySelectorAll(".board");

boards.forEach((board) => {
  board.addEventListener("click", () => {
    const row = board.getAttribute("data-row");
    const col = board.getAttribute("data-col");
    if (gameManager.getGameEnded()) {
      alert(`The game has ended! The winner is ${gameManager.getWinner()}`);
    } else {
      gameBoard.updateGameBoard(row, col);
      if (gameBoard.checkWinner()) {
        gameManager.toggleGameEnded();
      } else {
        gameManager.toggleCurrentTurn();
      }
    }
  });
});
