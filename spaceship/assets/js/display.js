// DOM elements.
const body = document.body
const modal = document.querySelector('.modal')
const startButton = document.querySelector('#startButton')
const bullet = document.querySelector('#award_bullet')
const award = document.querySelector('#award')
const bulletDisplay = document.querySelector('#bullets')
const enemyDisplay = document.querySelector('#enemies')
const scoreDisplay = document.querySelector('#score')
const bigScore = document.querySelector('#bigScore')

const ship_window = document.querySelector('.ship_window')
const text = document.querySelector('.text_window')
const earth = document.querySelector('.earth')

export default {
  earth,
  hideBoxes() {
    ship_window.style.display = 'none'
    text.style.display = 'none'
  },
  setEarthDiameter(diameter) {
    earth.style.width = `${diameter}px`
    earth.style.height = `${diameter}px`
  },
  showCursor() { body.style.cursor = '' },
  hideCursor() { body.style.cursor = 'none' },
  
  showModal() { modal.style.display = 'block' },
  hideModal() { modal.style.display = 'none' },
  enemy(value) { enemyDisplay.textContent = value },
  score(value) { scoreDisplay.textContent = value },
  bullet(value) { bulletDisplay.textContent = value },
  bigScore(value) { bigScore.textContent = value },
  info(value_1, value_2) {
    award.textContent = value_1
    bullet.textContent = value_2
  }
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
// set canvas size.
canvas.width = innerWidth
canvas.height = innerHeight - 6
console.log(`canvas size: ${canvas.width} x ${canvas.height}`);
const CENTER_X = canvas.width / 2
const CENTER_Y = canvas.height / 2
const MAX_X = canvas.width
const MAX_Y = canvas.height

// clear screen. only one option must be choosen
const clearScreen = () => {
  // option #1: with trailing.
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  // option #2: with no trailing.
  // c.clearRect(0, 0, canvas.width, canvas.height)
}

export { canvas, c, clearScreen, CENTER_X, CENTER_Y, MAX_X, MAX_Y }