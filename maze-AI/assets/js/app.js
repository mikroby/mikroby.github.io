import { createMaze } from './maze.js';

const start = () => {
  const grid = createMaze()
  // further development using grid here...
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
