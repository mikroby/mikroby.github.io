import { cols, rows } from './config.js'
import { display } from './display.js';

export { createMaze }

const grid = [];
const stack = [];
const visited = []
let neighbors = []

const initMaze = () => {
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    visited[i] = []
    for (let j = 0; j < cols; j++) {
      grid[i][j] = {
        top: true,
        bottom: true,
        right: true,
        left: true,
      };
      visited[i][j] = false
    }
  }
}

const getNeighbors = (row, col) => {
  const neighbors = []
  if (row > 0 && !visited[row - 1][col]) {
    neighbors.push({ row: row - 1, col });
  }
  if (row < rows - 1 && !visited[row + 1][col]) {
    neighbors.push({ row: row + 1, col });
  }
  if (col > 0 && !visited[row][col - 1]) {
    neighbors.push({ row, col: col - 1 });
  }
  if (col < cols - 1 && !visited[row][col + 1]) {
    neighbors.push({ row, col: col + 1 });
  }

  return neighbors
}

const removeWalls = (row, col, nextRow, nextCol) => {
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
}

const generatePath = (row, col) => {
  // mark current cell visited.
  visited[row][col] = true;
  // current cell position saved to stack.
  stack.push({ row, col });

  neighbors = getNeighbors(row, col)

  while (neighbors.length > 0) {
    // choose a neighbor randomly.
    const { row: nextRow, col: nextCol } = neighbors
      .splice(Math.floor(Math.random() * neighbors.length), 1)[0]

    // remove walls between the current and the chosen cells.
    removeWalls(row, col, nextRow, nextCol)

    // recursive call to next cell.
    generatePath(nextRow, nextCol);

  }

  if (stack.length > 1) {
    stack.pop();
    const cell = stack.pop();
    row = cell.row;
    col = cell.col;
    neighbors = getNeighbors(row, col)
  }
  
}

const createMaze = () => {
  initMaze()
  generatePath(0, 0)
  display(grid)

  return grid
}