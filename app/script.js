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
    console.log(getBoard().find((cell) => cell.getPosition() == playerChoice).isEmpty())
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
  const players = []
  let activePlayer = null

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
      switchTurn()
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
