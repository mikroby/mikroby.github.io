// Prevent clicks on header from affecting the canvas
document.querySelector('header').addEventListener('click', (event) =>
  event.stopPropagation()
);

const modeButton = document.querySelector('.btn__mode');
// toggle mode
modeButton.addEventListener('click', () =>
  setMode(mode === 'edit' ? 'simulation' : 'edit')
);

const speedSlider = document.querySelector('#speed-slider');
speedSlider.addEventListener('input', (event) =>
  setSpeed(Number(event.target.value))
);

const resolutionSlider = document.querySelector('#resolution-slider');
resolutionSlider.addEventListener('input', (event) =>
  setResolution(Number(event.target.value))
);