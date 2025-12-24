function keyPressed() {
  switch (keyCode) {
    case ENTER:
      mode === 'simulation' ? toggleLooping() : null;
      break;
    case 32: // on SPACE key
      mode === 'simulation' ? advanceOne() : null;
      break;
    case ESCAPE: // reset the simulation regardless of mode
      setup();
      break;
    default: // Allow other keys to perform their default actions
      return true;
  }

  // Prevent default behavior of special keys in browser
  return false;
}

function mouseClicked() {
  mode === 'simulation' ? advanceOne() : toggleCell();

  // Prevent default behavior of the mouse click
  return false;
}

function doubleClicked() {
  mode === 'simulation' ? toggleLooping() : null;

  // Prevent default behavior of the double click
  return false;
}
