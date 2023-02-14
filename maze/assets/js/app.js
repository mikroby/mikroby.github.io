import { createMaze } from './maze.js';
import { sprite } from './config.js';
import { Sprite } from './sprite.js';

let id

const start = () => {
  const maze = createMaze()

  // set start position of figure
  const { startCol, startRow } = sprite
  // directions: 0 = up, 1 = left, 2 = right, 3 = down
  const startDirection = Math.floor(Math.random() * 4)
  const figure = new Sprite(startCol, startRow, maze, startDirection)

  clearInterval(id)
  // move figure on timeouts.
  id = setInterval(() => figure.move(), sprite.time)


  // for further development add here...
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
