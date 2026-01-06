// keypressed() is a predefined function in p5.js
function keyPressed() {
  switch (keyCode) {
    case ENTER:
      if (mode === 'simulation') toggleLooping();
      break;
    case 32: // on SPACE key
      if (mode === 'simulation') advanceOne();
      break;
    case ESCAPE:
      initalize('random');
      break;
    default: // Allow other keys to perform their default actions
      return true;
  }

  // Prevent default behavior of special keys in browser
  return false;
}

// mouseClicked() is a predefined function in p5.js
function mouseClicked() {
  mode === 'simulation' ? advanceOne() : toggleCell();

  // Prevent default behavior of the mouse click
  return false;
}

// doubleClicked() is a predefined function in p5.js
function doubleClicked() {
  if (mode === 'simulation') toggleLooping();

  // Prevent default behavior of the mouse double-click
  return false;
}
