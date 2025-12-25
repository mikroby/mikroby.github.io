const create2DArray = (cols, rows) => {
  let array = new Array(cols);

  for (let i = 0; i < cols; i++) {
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

// count living neighbors of given cell.
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

const setMode = (nextMode) => {
  noLoop();
  mode = nextMode;
  modeButton.textContent = mode === 'edit' ? 'Simulation mode' : 'Edit mode';
}

const setSpeed = (nextSpeed) => {
  speed = nextSpeed;
  frameRate(speed);
  speedSlider.value = speed;
  speedSlider.nextSibling.replaceWith(`${speed.toFixed(1)} fps`);
}

const setResolution = (nextResolution) => {
  resolution = nextResolution;
  resolutionSlider.value = resolution;
  resolutionSlider.nextSibling.replaceWith(`${resolution} px/cell`);
}

const toggleCell = () => {
  const col = floor(mouseX / resolution);
  const row = floor(mouseY / resolution);

  generation[col][row] = generation[col][row] === 0 ? 1 : 0;
  redraw();
}
