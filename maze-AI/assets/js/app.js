import { createMaze } from './maze.js';
// for zooming only.
import { display, zoom } from './display.js';

const canvas = document.querySelector('.maze');

const start = () => {
  const grid = createMaze()

  // for zooming only.
  canvas.onwheel = (event) => {
    event.preventDefault();
    zoom(event)
    display(grid)
  };

  // for further development using grid here...
}

// starter IIFE.
(() => {
  start()
  const button = document.querySelector('.btn');
  button.addEventListener('click', start)
  button.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    start()
  })
})()
