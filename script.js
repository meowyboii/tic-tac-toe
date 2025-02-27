const createPlayer = function (name) {
  let playerName = name;
  let score = 0;
  const getPlayerName = () => playerName;
  const addScore = () => score++;
  const getScore = () => score;
  return { getPlayerName, addScore, getScore };
};

const gameManager = (function () {
  let player1;
  let player2;
  //Create player objects
  const initializePlayers = () => {
    let name = prompt("Enter the name of player 1:");
    player1 = createPlayer(name ?? "Player 1");
    name = prompt("Enter the name of player 2:");
    player2 = createPlayer(name ?? "Player 2");
  };
  //If current turn is true, then it is player 1's turn
  let currentTurn = true;
  const getCurrentTurn = () => currentTurn;
  const resetCurrentTurn = () => (currentTurn = true);
  const toggleCurrentTurn = () => {
    currentTurn = !currentTurn;
  };

  let numberOfTurns = 9;
  const getNumberOfTurns = () => numberOfTurns;
  const resetNumberOfTurns = () => (numberOfTurns = 9);
  const reduceNumberOfTurns = () => numberOfTurns--;

  const getWinner = () => {
    if (numberOfTurns == 0) {
      return "no one! It's a draw!";
    }
    if (currentTurn) {
      player1.addScore();
      return player1.getPlayerName();
    } else {
      player2.addScore();
      return player2.getPlayerName();
    }
  };
  const getPlayers = () => {
    return { player1: player1, player2: player2 };
  };
  return {
    initializePlayers,
    getCurrentTurn,
    toggleCurrentTurn,
    resetCurrentTurn,
    getWinner,
    getPlayers,
    getNumberOfTurns,
    reduceNumberOfTurns,
    resetNumberOfTurns,
  };
})();

const gameBoard = (function () {
  let gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const getGameBoard = () => gameBoard;
  const resetGameBoard = () => {
    gameBoard = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };
  const updateGameBoard = (row, col) => {
    if (gameBoard[row][col] !== "") {
      alert("This space is already taken!");
      gameManager.toggleCurrentTurn();
      return;
    }
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
  return { getGameBoard, updateGameBoard, resetGameBoard, checkWinner };
})();

const displayController = (function () {
  const displayGameBoard = () => {
    const boards = document.querySelectorAll(".board");
    const gameSpace = gameBoard.getGameBoard();
    boards.forEach((board) => {
      const row = board.getAttribute("data-row");
      const col = board.getAttribute("data-col");
      board.textContent = gameSpace[row][col];
    });
  };
  const endGamePanel = document.getElementById("end-result");

  const displayResults = () => {
    endGamePanel.style.display = "flex";

    //Announce winner
    const resultMessage = document.querySelector("#end-result h3");
    resultMessage.textContent = `The game has ended! The winner is ${gameManager.getWinner()}`;

    //Reveal player standings
    const { player1, player2 } = gameManager.getPlayers();
    const playerScores = document.querySelector("#end-result p");
    playerScores.textContent = `${player1.getPlayerName()} - ${player1.getScore()} \t ${player2.getPlayerName()} - ${player2.getScore()}  `;
  };
  const removeResults = () => {
    endGamePanel.style.display = "none";
  };
  return { displayGameBoard, displayResults, removeResults };
})();

const initializeGame = () => {
  //Create player objects
  gameManager.initializePlayers();
  //Main click function for the game board
  const boards = document.querySelectorAll(".board");
  boards.forEach((board) => {
    board.addEventListener("click", () => {
      const row = board.getAttribute("data-row");
      const col = board.getAttribute("data-col");
      gameBoard.updateGameBoard(row, col);
      displayController.displayGameBoard();
      if (gameBoard.checkWinner()) {
        displayController.displayResults();
      } else {
        gameManager.toggleCurrentTurn();
      }
    });
  });
};
const restart = () => {
  displayController.removeResults();
  gameManager.resetNumberOfTurns();
  gameManager.resetCurrentTurn();
  gameBoard.resetGameBoard();
  displayController.displayGameBoard();
};
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
});
