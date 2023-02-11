import { createMaze } from './maze.js';

// starter IIFE.
(() => {
  createMaze()
  const button = document.querySelector('.btn');
  button.addEventListener('click', createMaze)
  button.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    createMaze()
  })
})()
