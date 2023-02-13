import { createMaze } from './maze.js';
import { update } from './sprite.js';
import { sprite } from './config.js';

let id

const start = () => {
  const maze = createMaze()

  clearInterval(id)
  id = setInterval(() => update(maze), sprite.time)

  
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
