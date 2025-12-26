const create2DArray = (cols, rows) => {
  let array = new Array(cols);

  for (let i = 0; i < cols; i++) {
    array[i] = new Array(rows);
  }

  return array;
}

const initializeStatesOf = (array, method) => {
  const cols = array.length;
  const rows = array[0].length;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      array[i][j] = method === 'random' ? floor(random(2)) : 0;
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

const display = (array) => {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (array[i][j] === 1) {
        // fill(255); // white color for cells -> default value
        // fill(255, 165, 0); // orange color for cells
        rect(i * resolution, j * resolution, resolution - 1);
      }
    }
  }
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
  modeButton.textContent = nextMode === 'edit' ? 'Simulation mode' : 'Edit mode';
  mode = nextMode;
}

const setSpeed = (nextSpeed) => {
  frameRate(nextSpeed);
  speedSlider.value = nextSpeed;
  speedSlider.nextSibling.replaceWith(`${nextSpeed.toFixed(1)} fps`);
  speed = nextSpeed;
}

const setResolution = (nextResolution) => {
  resolutionSlider.value = nextResolution;
  resolutionSlider.nextSibling.replaceWith(`${nextResolution} px/cell`);
  resolution = nextResolution;
  if (generation) display(generation);
}

const toggleCell = () => {
  const col = floor(mouseX / resolution);
  const row = floor(mouseY / resolution);

  generation[col][row] = generation[col][row] === 0 ? 1 : 0;
  display(generation);
}
