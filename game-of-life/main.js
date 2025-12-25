setVersion('0.2.0');
let mode, cols, rows, generation, resolution = 8, speed = 3;

// setup() is a predefined function in p5.js - runs once at the start
function setup() {
  noStroke();
  setSpeed(speed);
  setMode('simulation');  // start in simulation mode
  setResolution(resolution);

  createCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);
  rows = floor(height / resolution);

  generation = create2DArray(cols, rows);

  randomizeStates(generation); // populate board with the first generation
  redraw(); // draw the first generation
}

// draw() is a predefined function in p5.js - runs continuously
// if isLooping is true
function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (generation[i][j] === 1) {
        // fill(255); // white color for cells
        // fill(255, 165, 0); // orange color for cells
        rect(i * resolution, j * resolution, resolution - 1);
      }
    }
  }

  // only draw for the edited cell in edit mode
  if (mode === 'edit') return;

  const next = create2DArray(cols, rows);

  // iterate next generation
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
}
