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
  startCol: 0,
  startRow: 0,
  color: 'red',
  fill: 'yellow',
  time: 100,
}

export {
  cols,
  rows,
  cellSize,
  color,
  width,
  sprite,
}