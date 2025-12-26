function keyPressed() {
  switch (keyCode) {
    case ENTER:
      if (mode === 'simulation') toggleLooping();
      break;
    case 32: // on SPACE key
      if (mode === 'simulation') advanceOne();
      break;
    case ESCAPE: // reset the simulation regardless of mode
      initalize('random');
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
  if (mode === 'simulation') toggleLooping();

  // Prevent default behavior of the mouse double click
  return false;
}
