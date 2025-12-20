const create2DArray = (cols, rows) => {
  let array = new Array(cols);

  for (let i = 0; i < array.length; i++) {
    array[i] = new Array(rows);
  }

  return array;
}

const randomizeStates = (array) => {
  const cols = array.length;
  const rows = array[0].length;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      array[i][j] = floor(random(2));
    }
  }
}

// count living neighbors around given cell.
// result includes the state of current cell!
const countNeighbors = (array, x, y, state) => {
  let sum = -state;

  for (let i = -1; i < 2; i++) {
    const col = x + i;

    if (col < 0 || col === cols) continue;

    for (let j = -1; j < 2; j++) {
      const row = y + j;

      if (row < 0 || row === rows) continue;

      sum += array[col][row];
    }
  }

  return sum;
}

const toggleLooping = () => {
  isLooping() ? noLoop() : loop();
}

const advanceOne = () => {
  isLooping() ? noLoop() : redraw();
}

const setVersion = (version) => {
  document.title = `${document.title} v${version}`;
}