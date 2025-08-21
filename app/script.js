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

  // Expects a player object and player choice (number) to place marker to a cell
  const placeMarker = (player, playerChoice) => {
    cell = getBoard().find((cell) => cell.getPosition() == playerChoice)
    cell.addMarker(player.getMarker())
  }

  return { getBoard, printBoard, placeMarker }
})();

function cell(mark = ' ', position) {
  const getMark = () => mark
  const getPosition = () => position
  const addMarker = (marker) => {
    mark = marker
  }

  return { getMark, getPosition, addMarker }
};

function player(name = 'Player', marker) {
  const getName = () => name
  const getMarker = () => marker

  return { getName, getMarker }
}

// Game simulation in console
console.log(gameboard.printBoard())
const player1 = player("Player1", "X")
gameboard.placeMarker(player1, 2)
console.log(gameboard.printBoard())
