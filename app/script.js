const gameboard = (function () {
  const board = []
  for (let i = 0; i < 9; i++) {
    board[i] = cell(' ', i)
  }

  const getBoard = () => board

  const printBoard = () => {
    console.log(`
     ${board[0].getMark()} | ${board[1].getMark()} | ${board[2].getMark()}  
    ---|---|---
     ${board[3].getMark()} | ${board[4].getMark()} | ${board[5].getMark()}
    ---|---|---
     ${board[6].getMark()} | ${board[7].getMark()} | ${board[8].getMark()}  
  `)
  }

  const isValidMove = (playerChoice) => {
    return getBoard().find((cell) => cell.getPosition() == playerChoice).isEmpty()
  }

  // Expects a player object and player choice (number) to place marker to a cell
  const placeMarker = (player, playerChoice) => {
    cell = getBoard().find((cell) => cell.getPosition() == playerChoice)
    cell.addMarker(player.getMarker())
  }

  return { getBoard, printBoard, placeMarker, isValidMove }
})();

/* 
** Controls the functionalities of the game, rounds, and player interaction.
** Pass player objects as the arguments 
*/
const gameController = (function () {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6]             // Diagonal
  ]
  const players = []
  let activePlayer = null
  let winner = null
  let result = null

  const getPlayers = () => ({ playerOne: players[0], playerTwo: players[1] })
  const setPlayers = (playerOne, playerTwo) => players.push(playerOne, playerTwo)

  const switchTurn = () => {
    return activePlayer == players[0] ? activePlayer = players[1] : activePlayer = players[0]
  }

  const getActivePlayer = () => activePlayer

  const start = () => {
    activePlayer = players[0]
    console.log("Let's play Tic Tac Toe!")
    gameboard.printBoard()
    playRound()
  }

  const isBoardIncomplete = () => gameboard.getBoard().find((cell) => cell.getMark() == ' ')

  const getWinner = () => winner
  const setWinner = () => {
    for (const winCondition of winConditions) {
      const combination = []

      winCondition.forEach((position) => {
        const cell = gameboard.getBoard().find(cell => cell.getPosition() == position)
        combination.push(cell.getMark().toUpperCase())
      })

      const winForX = combination.join('') == 'XXX'
      const winForO = combination.join('') == 'OOO'

      if (winForX || winForO) {
        winner = getActivePlayer()
        break;
      }
    }
  }

  const playRound = () => {
    console.log("Select a square to place marker")
    while (isBoardIncomplete()) {
      console.log(`${getActivePlayer().getName()}'s turn with ${getActivePlayer().getMarker()} marker.`)
      let playerChoice = Math.floor(Math.random() * 9)

      while (!gameboard.isValidMove(playerChoice)) {
        playerChoice = Math.floor(Math.random() * 9)
      }

      gameboard.placeMarker(getActivePlayer(), playerChoice)
      gameboard.printBoard()

      setWinner()
      if (winner) { break }

      switchTurn()
    }
    // Announce conclusion. It's draw if it didn't break from the while loop
    concludeRound()
  }

  const concludeRound = () => {
    if (winner) {
      result = 'win'
      console.log(`${winner.getName()} has won with ${winner.getMarker()}.`)
    } else {
      result = 'draw'
      console.log("It's a draw. Play again?")
    }
  }

  const getResult = () => result

  return { start, switchTurn, getActivePlayer, setPlayers, getPlayers, getWinner, getResult }
})();

// This deals with all of the UI for the game
const screenController = (function () {
  // Show modal when new game btn is clicked
  const newGameBtn = document.querySelector("#newGameBtn")
  const newGameDialog = document.querySelector("#newGameDialog")
  const newGameForm = document.querySelector("#newGameForm")
  const cancelBtn = document.querySelector("#cancelBtn")

  const newGameDetailsDiv = document.querySelector(".details .new-game")
  const gameDetailsDiv = document.querySelector(".details .game-details")

  const currentTurnParagraph = document.querySelector("#currentTurn")
  const playerOneParagraph = document.querySelector("#playerOne")
  const playerTwoParagraph = document.querySelector("#playerTwo")
  const resultParagraph = document.querySelector("#result")

  newGameBtn.addEventListener("click", () => {
    newGameDialog.showModal()
  })

  // Start game when form is completed
  newGameForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const playerOne = player(formData.get("player-one-name"), 'X')
    const playerTwo = player(formData.get("player-two-name"), 'O')
    gameController.setPlayers(playerOne, playerTwo)
    gameController.start()

    newGameDetailsDiv.classList.add("hide")
    gameDetailsDiv.classList.remove("hide")

    updateGameDetails()

    newGameDialog.close()
  })

  newGameDialog.addEventListener("close", () => {

  })

  cancelBtn.addEventListener("click", () => {
    newGameDialog.close()
  })

  const setBoard = () => {
    const boardDiv = document.querySelector(".board")
    for (let i = 0; i < 3; i++) {
      const col = document.createElement('div')
      col.classList = 'col'

      for (let j = 0; j < 3; j++) {
        const cell = document.createElement('div')
        cell.classList = 'cell'
        col.appendChild(cell)
      }

      col.addEventListener("click", (event) => {
        if (event.target.classList == 'cell') {
          console.log(event.target)
        }
      })

      boardDiv.appendChild(col)
    }
  }

  const updateGameDetails = () => {
    const playerOneName = gameController.getPlayers().playerOne.getName()
    const playerTwoName = gameController.getPlayers().playerTwo.getName()
    const activePlayerName = gameController.getActivePlayer().getName()
    const winner = gameController.getWinner()

    currentTurnParagraph.textContent = `Current turn: ${activePlayerName}`
    playerOneParagraph.textContent = `Player 1: ${playerOneName}`
    playerTwoParagraph.textContent = `Player 2: ${playerTwoName}`

    if (!gameController.getResult()) {
      resultParagraph.textContent = "The game is still ongoing."
    } else if (gameController.getResult() == 'draw') {
      resultParagraph.textContent = "The game is a draw."
    } else {
      resultParagraph.textContent = `The winner is ${winner.getName()}`
    }
  }

  return { setBoard, updateGameDetails }
})();

function cell(mark = ' ', position) {
  const getMark = () => mark
  const getPosition = () => position
  const isEmpty = () => getMark() == ' '
  const addMarker = (marker) => {
    mark = marker
  }

  return { getMark, getPosition, addMarker, isEmpty }
};

function player(name = 'Player', marker) {
  const getName = () => name
  const getMarker = () => marker

  return { getName, getMarker }
}

// On page load functions that should run
screenController.setBoard()

// Game simulation in console
// const playerOne = player("Player1", "X")
// const playerTwo = player("Player2", "O")
// gameController.setPlayers(playerOne, playerTwo)
// gameController.start()
