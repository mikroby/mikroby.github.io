// DOM elements.

const body = document.body
const modal = document.querySelector('.modal')

export default {
  startButton: document.querySelector('#startButton'),
  award: document.querySelector('#award'),
  bullet: document.querySelector('#award_bullet'),
  scoreDisplay: document.querySelector('#score'),
  bulletDisplay: document.querySelector('#bullets'),
  enemyDisplay: document.querySelector('#enemies'),
  bigScore: document.querySelector('#bigScore'),
  showCursor() { body.style.cursor = '' },
  hideCursor() { body.style.cursor = 'none' },
  showModal() { modal.style.display = 'block' },
  hideModal() { modal.style.display = 'none' },
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
// set canvas size.
canvas.width = innerWidth
canvas.height = innerHeight - 6
console.log(`${canvas.width} x ${canvas.height}`);
const CENTER_X = canvas.width / 2
const CENTER_Y = canvas.height / 2

export { canvas, c, CENTER_X, CENTER_Y }