import { cols, rows, cellSize, sprite } from './config.js'
import { leaveTrace } from './display.js'

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
  ctx.fillStyle = `${sprite.fill}`
  ctx.fill()
  ctx.stroke();
  ctx.beginPath()
  ctx.arc((col + 0.35) * cellSize, (row + 0.35) * cellSize, 2, 0, 2 * Math.PI)
  ctx.stroke();
  ctx.beginPath()
  ctx.arc((col + 0.65) * cellSize, (row + 0.35) * cellSize, 2, 0, 2 * Math.PI)
  ctx.stroke();
  ctx.beginPath()
  ctx.arc((col + 0.5) * cellSize, (row + 0.65) * cellSize, 4, 0, 2 * Math.PI)
  ctx.stroke();
}

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

const stopRun = (id) => {
  // stop timeouts.
  clearInterval(id)
  // show message.
  const message = document.querySelector('#message')
  message.textContent = 'Maze completed.'
  message.classList.toggle('hidden')
}

export class Sprite {

  constructor(col, row, grid) {
    this.col = col
    this.row = row
    this.grid = grid
    this.stack = []
  }

  move(id) {
    if (!this.grid[this.row][this.col].visited) leaveTrace(this.col, this.row)
    display(this.col, this.row)

    // mark current cell visited.
    this.grid[this.row][this.col].visited = true

    // collect neighbors with no walls facing to current position.
    const neighbors = getNeighbors(this.row, this.col, this.grid)

    let selected

    // collect not visited cells.
    const notVisited = neighbors.filter(cell => !this.grid[cell.row][cell.col].visited)

    if (notVisited.length > 0) {
      selected = notVisited[Math.floor(Math.random() * notVisited.length)]
      // save current position for backtrack.
      this.stack.push({ row: this.row, col: this.col })
    } else if (this.stack.length > 0) {
      selected = this.stack.pop()
    }

    if (selected) {
      // set next position.
      this.col = selected.col
      this.row = selected.row
    } else stopRun(id)

  }

}