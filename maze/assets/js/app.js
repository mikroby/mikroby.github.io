import { createMaze } from './maze.js';
import { sprite as config } from './config.js';
import { Sprite } from './sprite.js';

let id

const start = () => {
  const maze = createMaze()

  // set start position of figure
  const { startCol, startRow } = config 
  const figure = new Sprite(startCol, startRow, maze)

  clearInterval(id)
  // move figure on timeouts.
  id = setInterval(() => figure.move(), config.time)


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
