const cols = 15;
const rows = 15;
const cellSize = 40;
const color = {
  wall: 'black',
  grid: 'lightgrey',
}
const width = {
  wall: cellSize / 10,
  grid: cellSize / 20,
}
const sprite = {
  size: cellSize / 3,
  startPosition: {
    col: 0,
    row: 0,
  },
  color: 'red',
  time: 150,
}

export {
  cols,
  rows,
  cellSize,
  color,
  width,
  sprite,
}