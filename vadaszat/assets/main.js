'use strict'

import { Enemy, Particle, CrossHair } from './classes.js'
import { sound } from './sounds.js'
export { c, FRICTION }

// DOM elements:
const startGameButton = document.querySelector('#startButton')
const award = document.querySelector('#award')
const bullet = document.querySelector('#award_bullet')
const scoreDisplay = document.querySelector('#score')
const bulletDisplay = document.querySelector('#bullets')
const bigScore = document.querySelector('#bigScore')
const canvas = document.querySelector('canvas')
const modal = document.querySelector('.modal')

// canvas constants:
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerWidth / 2
// canvas.height = innerHeight-6
console.log(`${canvas.width} x ${canvas.height}`);
const CENTER_X = canvas.width / 2
const CENTER_Y = canvas.height / 2

// game constants:
const FRICTION = 0.99
const CROSSHAIR_RADIUS = 30 // in px
const START_TIMING = 300  // in ms
const ENEMY_TIMING = 1000 // in ms
const STOP_TIMING = 3000  // in ms
const START_BULLETS = 12
const AWARD_BULLETS = 5
const AWARD_POINT = 2000  // points
const SCORE_HIT = 100   // points
const SCORE_KILL = 300  // points
const PRECISION = -10   // in px
const MAX_ENEMY = 12

// game variables:
let enemies, particles, crossHair, shootTrigger,
  score, counter, numOfBullets,
  animationID, timerID,
  togglePause

const createEnemy = () => {
  timerID = setInterval(() => {
    if (togglePause) return

    const radius = Math.random() * (30 - 4) + 4
    let x, y

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    const color = `hsl(${Math.random() * 360},50%,50%)`
    const angle = Math.atan2(CENTER_Y - y, CENTER_X - x)
    const random = Math.random()
    const speedRatio = random < 0.2 ? 2 : 1
    const velocity = {
      x: Math.cos(angle) * speedRatio,
      y: Math.sin(angle) * speedRatio
    }

    if (enemies.length < MAX_ENEMY)
      enemies.push(new Enemy(x, y, radius, color, velocity, speedRatio))
  }, ENEMY_TIMING)
}

const scoreManager = (increment) => {
  score += increment
  scoreDisplay.textContent = score

  // check if bullets to be awarded.
  if (score > counter * AWARD_POINT) {
    counter++
    numOfBullets += AWARD_BULLETS
    bulletDisplay.textContent = numOfBullets
    sound.award()
  }
}

const createParticles = (x, y, radius, color) => {
  for (let i = 0; i < radius * 2; i++) {
    particles.push(new Particle(x, y, Math.random() * 2, color,
      {
        x: (Math.random() - 0.5) * (Math.random() * 6),
        y: (Math.random() - 0.5) * (Math.random() * 6)
      }
    ))
  }
}

const endGame = () => {
  window.removeEventListener('click', shoot)
  window.removeEventListener('keyup', checkKeyboard)
  window.removeEventListener('mousemove', moveCrossHair)

  // stop animation and show modal when timeout.
  const id = setTimeout(() => {
    clearTimeout(id)
    cancelAnimationFrame(animationID)
    clearInterval(timerID)

    bigScore.textContent = score
    modal.style.display = 'block'
    document.body.style.cursor = ''
  }, STOP_TIMING)
}

const animate = () => {
  animationID = requestAnimationFrame(animate)

  if (togglePause) return

  // clear screen.
  // with trailing:
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  // with no trailing:
  // c.clearRect(0, 0, canvas.width, canvas.height)  

  crossHair.draw()

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) particles.splice(index, 1)
    else particle.update()
  })

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update()

    // check hit if shoot triggered.
    if (shootTrigger) {
      const dist = Math.hypot(crossHair.x - enemy.x, crossHair.y - enemy.y)

      // enemy in the cross-hair within precision.
      if (dist - enemy.radius - crossHair.radius < PRECISION) {
        // play sound.
        sound.explosion()
        // create explosion effect.
        createParticles(enemy.x, enemy.y, enemy.radius, enemy.color)

        if (enemy.radius - 10 > 5) {
          // increase score.
          scoreManager(SCORE_HIT * enemy.worth)
          // shrink enemy.
          gsap.to(enemy, { radius: enemy.radius - 10 })
        } else {
          // increase score.
          scoreManager(SCORE_KILL * enemy.worth)
          // remove enemy.
          const id_1 = setTimeout(() => {
            clearTimeout(id_1)
            enemies.splice(enemyIndex, 1)
          })
        }
      }
    }
  })

  if (shootTrigger) shootTrigger = false
}

const shoot = () => {
  if (togglePause) return

  numOfBullets--
  bulletDisplay.textContent = numOfBullets
  sound.shoot()
  shootTrigger = true
  
  if (!numOfBullets) endGame()
}

const checkKeyboard = (event) => {
  // pressing ESCAPE toggles pause.
  if (event.code === 'Escape') togglePause = !togglePause
  if (togglePause) return
  // pressing SPACE.
  // if (event.code === 'Space') xyz()
}

const moveCrossHair = (event) => {
  crossHair.x = event.clientX
  crossHair.y = event.clientY
}

const init = () => {
  crossHair = new CrossHair(CENTER_X, CENTER_Y, CROSSHAIR_RADIUS, 'white')
  enemies = []
  particles = []

  score = 0
  counter = 1
  numOfBullets = START_BULLETS
  shootTrigger = false
  togglePause = false
  scoreDisplay.textContent = score
  bulletDisplay.textContent = numOfBullets

  const id = setTimeout(() => {
    clearTimeout(id)
    window.addEventListener('click', shoot)
    window.addEventListener('keyup', checkKeyboard)
    window.addEventListener('mousemove', moveCrossHair)
  }, START_TIMING)
}

// starter IIFE.
(() => {
  award.textContent = AWARD_POINT
  bullet.textContent = AWARD_BULLETS

  // start game by clicking the button, hide modal.
  startGameButton.addEventListener('click', () => {
    document.body.style.cursor = 'none'
    sound.pop()
    modal.style.display = 'none'
    init()
    animate()
    createEnemy()
  })

})()
