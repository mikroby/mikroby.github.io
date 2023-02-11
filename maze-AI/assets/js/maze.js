import { cols, rows } from './config.js'
import { display } from './display.js';

export { createMaze }

const grid = [];
const stack = [];

const initMaze = () => {
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = {
        top: true,
        bottom: true,
        right: true,
        left: true,
        visited: false
      };
    }
  }
}

const generatePath = (row, col) => {
  // mark current cell visited.
  grid[row][col].visited = true;
  // current cell position saved to stack.
  stack.push({ row, col });

  // collecting neighbors not visited, yet.
  const neighbors = [];
  if (row > 0 && !grid[row - 1][col].visited) {
    neighbors.push({ row: row - 1, col });
  }
  if (row < rows - 1 && !grid[row + 1][col].visited) {
    neighbors.push({ row: row + 1, col });
  }
  if (col > 0 && !grid[row][col - 1].visited) {
    neighbors.push({ row, col: col - 1 });
  }
  if (col < cols - 1 && !grid[row][col + 1].visited) {
    neighbors.push({ row, col: col + 1 });
  }

  while (neighbors.length > 0) {
    // chooose a neighbor randomly.
    const { row: nextRow, col: nextCol } = neighbors
      .splice(Math.floor(Math.random() * neighbors.length), 1)[0]

    // remove walls between the current and the chosen cells.
    if (nextRow < row) {
      grid[nextRow][nextCol].bottom = false;
      grid[row][col].top = false;
    }
    if (nextRow > row) {
      grid[nextRow][nextCol].top = false;
      grid[row][col].bottom = false;
    }
    if (nextCol < col) {
      grid[nextRow][nextCol].right = false;
      grid[row][col].left = false;
    }
    if (nextCol > col) {
      grid[nextRow][nextCol].left = false;
      grid[row][col].right = false;
    }

    generatePath(nextRow, nextCol);

    if (stack.length > 0) {
      const cell = stack.pop();
      row = cell.row;
      col = cell.col;
      // generatePath(row, col);
    }
  }

}

const createMaze = () => {
  initMaze()
  generatePath(0, 0)
  display(grid)

  return grid
}