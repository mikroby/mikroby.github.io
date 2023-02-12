import { createMaze } from './maze.js';
import { update } from './sprite.js';
import { sprite } from './config.js';
// for zooming only.
// import { display, zoom } from './display.js';
// const canvas = document.querySelector('.maze');

let id

const start = () => {
  const grid = createMaze()

  clearInterval(id)
  id = setInterval(() => update(grid), sprite.time)

  // for zooming only.
  // canvas.onwheel = (event) => {
  //   event.preventDefault();
  //   zoom(event)
  //   display(grid)
  // };

  // for further development using grid here...
}

// starter IIFE.
(() => {
  start()
  // add user action to button
  const button = document.querySelector('.btn');
  button.addEventListener('click', start)
  button.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    start()
  })
})()
