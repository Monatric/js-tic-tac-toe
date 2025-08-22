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
      console.log(`${winner.getName()} has won with ${winner.getMarker()}.`)
    } else {
      console.log("It's a draw. Play again?")
    }
  }

  return { start, switchTurn, getActivePlayer, setPlayers }
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

// Game simulation in console
const playerOne = player("Player1", "X")
const playerTwo = player("Player2", "O")
gameController.setPlayers(playerOne, playerTwo)
gameController.start()
