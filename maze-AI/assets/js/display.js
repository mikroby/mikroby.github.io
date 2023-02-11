import { cols, rows, cellSize, color, width } from './config.js'

export { display }

const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
canvas.width = cols * cellSize
canvas.height = rows * cellSize

const display = (grid) => {
  
  // clear canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath()

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * cellSize;
      const y = i * cellSize;
      const cell = grid[i][j]

      // draw grid.
      ctx.strokeStyle = `${color.grid}`;
      ctx.lineWidth = width.grid;
      ctx.strokeRect(x, y, cellSize, cellSize)

      // draw walls.
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

  ctx.strokeStyle = `${color.wall}`;
  ctx.lineWidth = width.wall;
  ctx.stroke();

}