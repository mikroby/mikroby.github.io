let mode, cols, rows, generation, resolution, speed, grid;

// setup() is a predefined function in p5.js - runs once at startup
function setup() {
  setVersion('0.3.4');

  createCanvas(windowWidth, windowHeight);
  grid = createGraphics(windowWidth, windowHeight);

  noStroke();
  // fill(255); // white color for cells -> default value
  // fill(255, 165, 0); // orange color for cells
  // fill(255, 160, 122); // lightsalmon color for cells
  fill('#ffff00'); // yellow color for cells
  setSpeed(3);
  setMode('simulation');
  setResolution(8);

  cols = floor(width / resolution);
  rows = floor(height / resolution);
  generation = create2DArray(cols, rows);

  // initalize('random');
}

const initalize = (method) => {
  noLoop();
  initializeStatesOf(generation, method); // populate first generation by method
  display(generation);
}

// draw() is a predefined function in p5.js - cycling if isLooping is true
function draw() {
  // iterate next generation
  const next = create2DArray(cols, rows);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const state = generation[x][y];
      const neighbors = countLivingNeighbors(generation, x, y, state);

      if (state === 0 && neighbors === 3) {
        next[x][y] = 1; // born
        continue;
      }

      if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[x][y] = 0; // dies
        continue;
      }

      next[x][y] = state; // survives or remains dead
    }
  }

  generation = next; // update generation to next
  display(generation);
}
