import { cols, rows, cellSize, color, width, sprite } from './config.js'

export { displayMaze, leaveTrace }

// set canvas.
const canvas = document.querySelector('.maze');
const ctx = canvas.getContext('2d');
canvas.width = cols * cellSize
canvas.height = rows * cellSize

const displayMaze = (grid) => {

  // clear canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // styling grid.
  ctx.strokeStyle = `${color.grid}`;
  ctx.lineWidth = width.grid;

  ctx.beginPath()

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * cellSize;
      const y = i * cellSize;
      const cell = grid[i][j]

      // draw grid.      
      ctx.strokeRect(x, y, cellSize, cellSize)

      // set path for walls.
      if (cell.top) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
      }
      if (cell.bottom) {
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
      }
      if (cell.right) {
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
      }
      if (cell.left) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
      }
    }
  }

  // styling wall.
  ctx.strokeStyle = `${color.wall}`;
  ctx.lineWidth = width.wall;
  // draw all walls path at once.
  ctx.stroke();

}

const leaveTrace = (col, row) => {
  ctx.beginPath()
  ctx.strokeStyle = `${sprite.traceColor}`;
  ctx.arc((col + 0.5) * cellSize, (row + 0.5) * cellSize, sprite.size / 20, 0, 2 * Math.PI);
  ctx.stroke();
}