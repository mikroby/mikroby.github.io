import { cols, rows, cellSize, sprite } from './config.js'

export { update }

// set canvas
const canvas = document.querySelector('.sprite')
const ctx = canvas.getContext('2d')
canvas.width = cols * cellSize
canvas.height = rows * cellSize

const display = (col, row) => {
  // clear canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw object.
  ctx.beginPath()
  ctx.strokeStyle = `${sprite.color}`;
  ctx.arc((col + 0.5) * cellSize, (row + 0.5) * cellSize, sprite.size, 0, 2 * Math.PI);
  ctx.stroke();
}

// default position.
let { col, row } = sprite.startPosition
// default direction 0...3 randomly.
let direction = Math.floor(Math.random() * 4)

const getNeighbors = (row, col, grid) => {
  const neighbors = [];
  if (row > 0 && !grid[row][col].top) {
    neighbors.push({ row: row - 1, col });
  }
  if (row < rows - 1 && !grid[row][col].bottom) {
    neighbors.push({ row: row + 1, col });
  }
  if (col > 0 && !grid[row][col].left) {
    neighbors.push({ row, col: col - 1 });
  }
  if (col < cols - 1 && !grid[row][col].right) {
    neighbors.push({ row, col: col + 1 });
  }
  return neighbors
}

const update = (grid) => {
  display(col, row)

  // collecting neighbors with no walls to current position.
  const neighbors = getNeighbors(row, col, grid)

  if (neighbors.length > 0) {
    
    let selected, nextCol, nextRow

    // version#1: moves to current direction until not possible.
    do {
      nextCol = direction === 1 ? col - 1 : direction === 2 ? col + 1 : col
      nextRow = direction === 0 ? row - 1 : direction === 3 ? row + 1 : row

      selected = neighbors.find(cell => cell.row === nextRow && cell.col === nextCol)

      if (!selected) {
        direction = Math.floor(Math.random() * 4)
      }

    } while (!selected)

    // version#2: every step random.
    // const selected = neighbors[Math.floor(Math.random() * neighbors.length)]

    col = selected.col
    row = selected.row
  }

}