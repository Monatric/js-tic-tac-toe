const gameboard = (function () {
  const board = []
  for (let i = 0; i < 9; i++) {
    board[i] = cell()
  }

  const printBoard = () => {
    console.log(`
     ${board[0].mark} | ${board[1].mark} | ${board[2].mark}  
    ---|---|---
     ${board[3].mark} | ${board[4].mark} | ${board[5].mark}
    ---|---|---
     ${board[6].mark} | ${board[7].mark} | ${board[8].mark}  
  `)
  }

  return { printBoard }
})();

function cell(mark = ' ') {
  return { mark }
}; 