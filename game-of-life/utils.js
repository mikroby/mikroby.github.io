const create2DArray = (cols, rows) => {
  let array = new Array(cols);

  for (let col = 0; col < cols; col++) {
    array[col] = new Array(rows);
  }

  return array;
}

const initializeStatesOf = (array, method) => {
  const cols = array.length;
  const rows = array[0].length;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      array[x][y] = method === 'random' ? floor(random(2)) : 0;
    }
  }
}

const countLivingNeighbors = (array, x, y, state) => {
  let sum = -state;

  for (let dx = -1; dx < 2; dx++) {
    const col = x + dx;

    if (col < 0 || col === cols) continue;

    for (let dy = -1; dy < 2; dy++) {
      const row = y + dy;

      if (row < 0 || row === rows) continue;

      sum += array[col][row];
    }
  }

  return sum;
}

const display = (array) => {
  clear();
  image(grid, 0, 0); // display grid in the background

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (array[x][y] === 1) {
        rect(x * resolution, y * resolution, resolution - 1);
      }
    }
  }
}

const drawGrid = (color = '#989898', bgColor = '#7e7e7e') => {
  grid.background(bgColor);

  if (resolution < 4) return; // skip re-drawing grid for small resolutions

  grid.strokeWeight(1);
  grid.stroke(color);

  // vertical lines
  for (let x = resolution; x < width; x += resolution) {
    grid.line(x, 0, x, height);
  }
  // horizontal lines
  for (let y = resolution; y < height; y += resolution) {
    grid.line(0, y, width, y);
  }
};

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
  modeButton.textContent = nextMode === 'edit' ? 'Simulation' : 'Edit mode';
  mode = nextMode;
}

const setSpeed = (nextSpeed) => {
  frameRate(nextSpeed);
  speedSlider.value = nextSpeed;
  speedSlider.nextElementSibling.textContent = nextSpeed.toFixed(1);
  speed = nextSpeed;
}

const setResolution = (nextResolution) => {
  resolutionSlider.value = nextResolution;
  resolutionSlider.nextElementSibling.textContent = nextResolution;
  resolution = nextResolution;

  drawGrid();
  if (generation) display(generation);
}

const toggleCell = () => {
  const x = floor(mouseX / resolution);
  const y = floor(mouseY / resolution);

  generation[x][y] = generation[x][y] === 0 ? 1 : 0;
  display(generation);
}
