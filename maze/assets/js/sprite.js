import { cols, rows, cellSize, sprite } from './config.js'

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

export class Sprite {

  constructor(col, row, grid, direction) {
    this.col = col
    this.row = row
    this.grid = grid
    this.direction = direction
  }

  move() {
    display(this.col, this.row)
    // mark current cell visited.
    this.grid[this.row][this.col].visited = true

    // collecting neighbors with no walls facing to current position.
    const neighbors = getNeighbors(this.row, this.col, this.grid)

    // in a maze you can always go backwards. no need to check this.
    // if (neighbors.length === 0) return

    let selected

    // version_#1: moves to current direction until not possible.
    do {
      const nextCol = this.direction === 1 ?
        this.col - 1 : this.direction === 2 ?
          this.col + 1 : this.col
      const nextRow = this.direction === 0 ?
        this.row - 1 : this.direction === 3 ?
          this.row + 1 : this.row

      selected = neighbors.find(cell => cell.row === nextRow && cell.col === nextCol)

      if (!selected) {
        const notVisited = neighbors.filter(cell => !this.grid[cell.row][cell.col].visited)
        if (notVisited.length > 0) {
          selected = notVisited[0]
          this.direction = selected.col === this.col ? 3 * (selected.row > this.row) : 1 + (selected.col > this.col)
        } else {
          switch (this.direction) {
            case 0:
              this.direction = 3
              break
            case 1:
              this.direction = 2
              break
            case 2:
              this.direction = 1
              break
            case 3:
              this.direction = 0
          }

        }
      }

    } while (!selected)

    // version_#2: every step random, "headless".
    // const selected = neighbors[Math.floor(Math.random() * neighbors.length)]

    this.col = selected.col
    this.row = selected.row

  }

}