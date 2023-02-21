import { createMaze } from './maze.js';
import { sprite as config } from './config.js';
import { Sprite } from './sprite.js';

let id

const start = () => {
  // hide message.
  const message = document.querySelector('#message')
  message.classList.add('hidden')
  
  const maze = createMaze()

  // set new figure.
  const figure = new Sprite(config.startCol, config.startRow, maze)

  clearInterval(id)
  // move figure on timeouts.
  id = setInterval(() => figure.move(id), config.time)

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
