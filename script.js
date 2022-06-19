window.addEventListener('load', () => {
  // Create board
  const board = document.getElementById('board');
  const numbers = document.getElementById('numbers');
  for(let i = 0 ; i < 9 ; i++) {
    const number = document.createElement('div');
    number.classList.add('number');
    number.onclick = () => onFill(i + 1);
    number.innerText = `${i + 1}`;
    numbers.appendChild(number);
    const boardRow = document.createElement('div');
    boardRow.classList.add('board-row');
    board.appendChild(boardRow);
    for (let j = 0 ; j < 9 ; j++) {
      const square = document.createElement('div');
      square.id = `${i}-${j}`;
      square.onclick = () => onSelect(i, j);
      square.classList.add('square');
      if (!(i % 3)) square.style.marginTop = '5px';
      if (i === 8) square.style.marginBottom = '5px';
      if (!(j % 3)) square.style.marginLeft = '5px';
      if (j === 8) square.style.marginRight = '5px';
      boardRow.appendChild(square);
    }
  }
})

document.addEventListener('keypress', ({key}) => {
 if (key >= 1 && key <= 9) {
   onFill(key);
 }
}, false);

const copyOf = (v) => JSON.parse(JSON.stringify(v))

const getColumns = (currentPlayableBoard) => {
  const columns = []
  for (let i = 0 ; i < 9 ; i++) {
    columns.push([])
    for (let j = 0 ; j < 9 ; j++) {
      columns[i][j] = currentPlayableBoard[j][i]
    }
  }
  return columns;
}

const getSquares = (currentPlayableBoard) => {
  const squares = []
  for (let i = 0 ; i < 9 ; i += 3) {
    for (let j = 0 ; j < 9 ; j += 3) {
      squares.push([]);
      for (let k = 0 ; k < 3 ; k++) {
        for (let l = 0 ; l < 3 ; l++) {
          squares[squares.length - 1].push(currentPlayableBoard[i + k][j + l]);
        }
      }
    }
  }
  return squares;
}

const isUnique = (arr) => {
  const noZeros = arr.filter((n) => !!n);
  return [...new Set(noZeros)].length === noZeros.length;
}

const isBoardValid = (board) => {
  const isRowsValid = board.every((row) => isUnique(row));
  const isColumnsValid = getColumns(board).every((row) => isUnique(row));
  const isSquaresValid = getSquares(board).every((row) => isUnique(row));
  return (isRowsValid && isColumnsValid && isSquaresValid);
}

const getRandNumber = (arr) => {
  const rand = Math.floor(Math.random() * arr.length);
  const num = arr[rand];
  arr.splice(rand, 1);
  return num;
}

const getPossibleNumbers = (board, i, j) => {
  const possibleNumbers = [];
  const filledNumbers = [];
  // Row
  for (let k = 0 ; k < 9 ; k++) {
    if (board[i][k] !== 0) {
      filledNumbers.push(board[i][k]);
    }
  }
  // Column
  for (let k = 0 ; k < 9 ; k++) {
    if (board[k][j] !== 0) {
      filledNumbers.push(board[k][j]);
    }
  }

  // Square
  for (let k = 0 ; k < 9 ; k++) {
    for (let l = 0 ; l < 9 ; l++) {
      if ((Math.floor(k / 3) ===  Math.floor(i / 3)) && (Math.floor(l / 3) ===  Math.floor(j / 3))) {
        if (board[k][l] !== 0) {
          filledNumbers.push(board[k][l]);
        }
      }
    }
  }

  for (let k = 1 ; k <= 9 ; k++) {
    if (!filledNumbers.includes(k)) {
      possibleNumbers.push(k)
    }
  }
  return possibleNumbers;
}

const getFreeCell = (board) => {
  for (let i = 0 ; i < board.length ; i++) {
    for (let j = 0 ; j < board.length ; j++) {
      if (!board[i][j]) {
        return [i, j];
      }
    }
  }
  return null;
}

let solutions = [];
const solver = (board) => {
  if (solutions.length >= 15) return;
  const newBoard = copyOf(board);
  const freeCell = getFreeCell(newBoard);
  if (freeCell) {
    const possibleNumbers = getPossibleNumbers(newBoard, ...freeCell);
    while (possibleNumbers.length) {
      newBoard[freeCell[0]][freeCell[1]] = getRandNumber(possibleNumbers);
      solver(newBoard);
    }
  } else {
    solutions.push(newBoard)
  }
}

const removeSelected = () =>
    [...document.getElementsByClassName('selected')].forEach((e) => e.classList.remove('selected'))

const onSelect = (i, j) => {
  removeSelected();
  document.getElementById(`${i}-${j}`).classList.add('selected');
}

const onFill = (number) => {
  const selected = document.getElementsByClassName('selected')[0];
  if (selected) {
    selected.innerText = number;
    selected.onClick = null;
    selected.classList.add('static');
  }
  removeSelected();
}

const readBoard = () => {
  const board = [];
  for(let i = 0 ; i < 9 ; i++) {
    board.push([]);
    for (let j = 0 ; j < 9 ; j++) {
      const square = document.getElementById(`${i}-${j}`);
      board[i][j] = parseInt(square.innerText) || 0;
    }
  }
  return board;
}

const writeBoard = (solution) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const square = document.getElementById(`${i}-${j}`);
      square.innerText = solution[i][j];
      square.onclick = null;
    }
  }
}

const onNav = (by) => {
  const currentSolutionElement = document.getElementById('current-solution');
  const totalSolutionsElement = document.getElementById('total-solutions');
  const index = Math.min(Math.max(1, parseInt(currentSolutionElement.innerText) + by), parseInt(totalSolutionsElement.innerText));
  currentSolutionElement.innerText = index.toString();
  writeBoard(solutions[index - 1]);
}

const onReset = () => {
  removeSelected();
  solutions = [];
  document.getElementById('current-solution').innerText = '0';
  document.getElementById('total-solutions').innerText = '0';
  for(let i = 0 ; i < 9 ; i++) {
    for (let j = 0 ; j < 9 ; j++) {
      const square = document.getElementById(`${i}-${j}`);
      square.innerText = ''
      square.onclick = () => onSelect(i, j);
      square.classList.remove('static')
    }
  }
}

const onSolve = () => {
  removeSelected();
  solutions = [];
  const board = readBoard();
  if (isBoardValid(board)) {
    solver(board);
    if (solutions.length) {
      const currentSolution = 1;
      const totalSolutions = solutions.length;
      document.getElementById('current-solution').innerText = currentSolution.toString();
      document.getElementById('total-solutions').innerText = totalSolutions.toString();
      writeBoard(solutions[currentSolution - 1]);
    } else {
      alert('No solutions were found!');
    }
  } else {
    alert('Invalid board!');
  }

}
