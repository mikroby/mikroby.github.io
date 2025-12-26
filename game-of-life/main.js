let mode, cols, rows, generation, resolution = 8, speed = 3;

// setup() is a predefined function in p5.js - runs once at startup
function setup() {
  setVersion('0.2.0');
  noStroke();
  setSpeed(speed);
  setMode('simulation');
  setResolution(resolution);
  createCanvas(windowWidth, windowHeight);

  cols = floor(width / resolution);
  rows = floor(height / resolution);
  generation = create2DArray(cols, rows);

  initalize('random');
}

const initalize = (method) => {
  noLoop();
  initializeStatesOf(generation, method); // populate board with the first generation
  display(generation);
}

// draw() is a predefined function in p5.js - cycling if isLooping is true
function draw() {
  // iterate next generation
  const next = create2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const state = generation[i][j];
      const neighbors = countNeighbors(generation, i, j, state);

      if (state === 0 && neighbors === 3) {
        next[i][j] = 1; // birth
        continue;
      }

      if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0; // death
        continue;
      }

      next[i][j] = state; // survival
    }
  }

  generation = next; // update generation
  display(generation);
}
