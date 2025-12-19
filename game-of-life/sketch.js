let cols, rows, generation, resolution = 2;

const create2DArray = (cols, rows) => {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
}

const countNeighbors = (gen, x, y) => {
  let sum = 0;

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const col = x + i;
      const row = y + j;

      if (col < 0 || row < 0 || col === cols || row === rows) {
        continue;
      }

      sum += gen[col][row];
    }
  }

  return sum;
}

// setup is a predefined function in p5.js - runs once at the start
function setup() {
  createCanvas(windowWidth - 4, windowHeight - 4);
  cols = floor(width / resolution);
  rows = floor(height / resolution);

  generation = create2DArray(cols, rows);

  // initialize generation with random values of 0s and 1s
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      generation[i][j] = floor(random(2));
    }
  }

  noLoop(); // start with noLoop to pause the simulation
  redraw(); // draw the initial state
}

// draw is a predefined function in p5.js - runs continuously in a loop
function draw() {
  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (generation[i][j] === 1) {
        fill(255);
        noStroke();
        rect(i * resolution, j * resolution, resolution - 1, resolution - 1);
      }
    }
  }

  const next = create2DArray(cols, rows);

  // compute next generation
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const state = generation[i][j];
      const neighbors = countNeighbors(generation, i, j) - state;

      if (state === 0 && neighbors === 3) {
        // birth
        next[i][j] = 1;
        continue;
      }

      if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        // death
        next[i][j] = 0;
        continue;
      }

      // survival
      next[i][j] = state;
    }
  }

  // update generation
  generation = next;
}

function keyPressed() {
  const looping = isLooping();

  switch (keyCode) {
    case ENTER:
      // Toggle loop/noLoop on ENTER key press
      looping ? noLoop() : loop();
      break;
    case 32:
      // Advance one generation on SPACE key press
      !looping ? redraw() : null;
      break;
    case ESCAPE:
      // Reset on ESCAPE key press
      noLoop();
      setup();
  }
}
