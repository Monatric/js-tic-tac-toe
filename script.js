// This is the internal structure of the board, adds markers, and enforces move validation
const gameboard = (function () {
  const board = []

  const getBoard = () => board
  const setBoard = () => {
    board.length = 0 // Resets to empty, ensuring no cells
    for (let i = 0; i < 9; i++) {
      board.push(cell(' ', i))
    }
  }

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
    return getBoard().find((cell) => cell.getPosition() == parseInt(playerChoice)).isEmpty()
  }

  // Expects a player object and player choice (number) to place marker to a cell
  const placeMarker = (player, playerChoice) => {
    const selectedCell = getBoard().find((cell) => cell.getPosition() == playerChoice)
    selectedCell.addMarker(player.getMarker())
  }

  return { getBoard, setBoard, printBoard, placeMarker, isValidMove }
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
  const setPlayers = (playerOne, playerTwo) => {
    players.length = 0 // Ensure no players before adding new ones
    players.push(playerOne, playerTwo)
  }

  const switchTurn = () => {
    return activePlayer == players[0] ? activePlayer = players[1] : activePlayer = players[0]
  }

  const getActivePlayer = () => activePlayer

  const start = () => {
    resetResultAndWinner() // Ensure winner and result are back to empty
    activePlayer = players[0]
    console.log("Let's play Tic Tac Toe!")
    gameboard.setBoard()
    gameboard.printBoard()
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

  const playRound = (playerChoice) => {
    console.log(`${getActivePlayer().getName()}'s turn with ${getActivePlayer().getMarker()} marker.`)

    console.log(getActivePlayer())
    gameboard.placeMarker(getActivePlayer(), playerChoice)
    gameboard.printBoard()

    setWinner()
    if (winner || !isBoardIncomplete()) { return concludeRound() }

    switchTurn()
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

  const resetResultAndWinner = () => {
    winner = null
    result = null
  }

  return { start, switchTurn, getActivePlayer, setPlayers, getPlayers, getWinner, getResult, playRound }
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

  const boardDiv = document.querySelector(".board")

  newGameBtn.addEventListener("click", () => {
    newGameDialog.showModal()
  })

  // Start game when form is completed
  newGameForm.addEventListener("submit", (event) => {
    event.preventDefault()

    resetBoard() // Reset board every new game
    enableBoard() // Enable board as it is disabled by default

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
    gameboard.setBoard() // The internal workings for the TTT
    disableBoard()
    gameboard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement('div')
      cellDiv.classList = 'cell'
      cellDiv.dataset.position = index

      cellDiv.addEventListener("click", (event) => {
        if (event.target.classList == 'cell') {
          const marker = gameController.getActivePlayer().getMarker()
          const xMarkerImg = document.createElement('img')
          xMarkerImg.src = './images/ttt-x.png'

          const oMarkerImg = document.createElement('img')
          oMarkerImg.src = './images/ttt-o.png'

          event.target.appendChild(marker == 'X' ? xMarkerImg : oMarkerImg)
          gameController.playRound(event.target.dataset.position)

          updateGameDetails()
        }
      })
      boardDiv.appendChild(cellDiv)
    })
  }

  const updateGameDetails = () => {
    const currentTurnParagraph = document.querySelector("#currentTurn")
    const playerOneParagraph = document.querySelector("#playerOne")
    const playerTwoParagraph = document.querySelector("#playerTwo")
    const resultParagraph = document.querySelector("#result")

    const playerOneName = gameController.getPlayers().playerOne.getName()
    const playerTwoName = gameController.getPlayers().playerTwo.getName()
    const activePlayerName = gameController.getActivePlayer().getName()
    const winner = gameController.getWinner()

    currentTurnParagraph.textContent = `Current turn: ${activePlayerName}`
    playerOneParagraph.textContent = `Player 1: ${playerOneName} | X`
    playerTwoParagraph.textContent = `Player 2: ${playerTwoName} | O`

    if (!gameController.getResult()) {
      resultParagraph.textContent = "The game is still ongoing."
    } else if (gameController.getResult() == 'draw') {
      resultParagraph.textContent = "The game is a draw."
      disableBoard()
    } else {
      resultParagraph.textContent = `The winner is ${winner.getName()}`
      disableBoard()
    }
  }

  const enableBoard = () => {
    boardDiv.style.removeProperty('pointer-events')
  }

  const disableBoard = () => {
    boardDiv.style.pointerEvents = 'none' // Disable cells first upon setup
  }

  const resetBoard = () => {
    boardDiv.replaceChildren()
    setBoard()
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

// TODO: Refactor. Make code look readable and organized. All the project specs are met.