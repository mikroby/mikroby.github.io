setVersion('0.1.0');

let cols, rows, generation, resolution = 2;

// setup is a predefined function in p5.js - runs once at the start
function setup() {
  createCanvas(windowWidth - 4, windowHeight - 4);
  cols = floor(width / resolution);
  rows = floor(height / resolution);

  generation = create2DArray(cols, rows);

  // initialize generation states
  randomizeStates(generation);

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

  // iterate next generation
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const state = generation[i][j];
      const neighbors = countNeighbors(generation, i, j, state);

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
  switch (keyCode) {
    case ENTER:
      toggleLooping();
      break;
    case 32: // on SPACE key
      advanceOne();
      break;
    case ESCAPE: // reset the simulation
      noLoop();
      setup();
      break;
    default: // Allow other keys to perform their default actions
      return true;
  }

  // Prevent default behavior of special keys
  return false;
}

function mouseClicked() {
  advanceOne();

  // Prevent default behavior of the mouse click
  return false;
}

function doubleClicked() {
  toggleLooping();

  // Prevent default behavior of the double click
  return false;
}
