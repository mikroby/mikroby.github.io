// Prevent clicks on header from affecting the canvas
const header = document.querySelector('header')
header.addEventListener('click', (event) =>
  event.stopPropagation()
);
header.addEventListener('dblclick', (event) => event.stopPropagation());

const modeButton = document.querySelector('.btn__mode');
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

document.querySelector('.btn__rnd').addEventListener('click', () => initalize('random'))

document.querySelector('.btn__empty').addEventListener('click', () => initalize('empty'))