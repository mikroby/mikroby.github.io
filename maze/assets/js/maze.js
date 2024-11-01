import { cols, rows } from './config.js'
import { displayMaze } from './display.js';

const grid = []

const initMaze = () => {
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = {
        top: true,
        bottom: true,
        right: true,
        left: true,
        visited: false,
      };
    }
  }
}

const getNeighbors = (row, col) => {
  const neighbors = []
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

  return neighbors
}

const removeWalls = (row, col, nextRow, nextCol) => {
  if (nextRow < row) {
    grid[nextRow][nextCol].bottom = false;
    grid[row][col].top = false;
    return
  }
  if (nextRow > row) {
    grid[nextRow][nextCol].top = false;
    grid[row][col].bottom = false;
    return
  }
  if (nextCol < col) {
    grid[nextRow][nextCol].right = false;
    grid[row][col].left = false;
    return
  }
  // if (nextCol > col) {
  grid[nextRow][nextCol].left = false;
  grid[row][col].right = false;
  // }
}

const generatePath = (row, col) => {
  grid[row][col].visited = true;
  let neighbors = getNeighbors(row, col)

  while (neighbors.length > 0) {
    // choose a neighbor randomly.
    const { row: nextRow, col: nextCol } = neighbors
      .splice(Math.floor(Math.random() * neighbors.length), 1)[0]

    removeWalls(row, col, nextRow, nextCol)
    // recursive call to next cell.
    generatePath(nextRow, nextCol);
    // return back to here from recursive call.
    neighbors = getNeighbors(row, col)
  }
}

export const createMaze = () => {
  initMaze()
  generatePath(0, 0)
  displayMaze(grid)

  // init prop "visited" to false.
  grid.forEach(row => {
    row.forEach(col => col.visited = false)
  });

  return grid
}