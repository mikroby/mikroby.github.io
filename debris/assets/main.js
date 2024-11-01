'use strict'

import { Player, Projectile, Enemy, Particle, Bomb } from './classes.js'
import { sound } from './sounds.js'
export { c, FRICTION }

// DOM elements:
const startGameButton = document.querySelector('#startButton')
const awardDisplay = document.querySelector('#award')
const scoreDisplay = document.querySelector('#score')
const bombDisplay = document.querySelector('#bombs')
const bigScore = document.querySelector('#bigScore')
const canvas = document.querySelector('canvas')
const modal = document.querySelector('.modal')

// canvas constants:
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
const CENTER_X = canvas.width / 2
const CENTER_Y = canvas.height / 2

// game constants:
const FRICTION = 0.99
const SPEED_RATIO = 5
const BOMB_RANGE = (CENTER_X > CENTER_Y ? CENTER_Y : CENTER_X) / 2
const ENEMY_TIMING = 1000 // time in ms
const STOP_TIMING = 5000  // time in ms
const AWARD = 2000  // points
const SCORE_HIT = 100 // points
const SCORE_KILL = 250  // points

// game variables:
let player, projectiles, enemies, particles, bomb,
  score, counter, numOfBombs,
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
    const ratio = Math.random() < 0.2 ? 2 : 1
    const velocity = {
      x: Math.cos(angle) * ratio,
      y: Math.sin(angle) * ratio
    }

    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, ENEMY_TIMING)
}

const scoreManager = (increment) => {
  if (!player) return

  score += increment
  scoreDisplay.textContent = score

  // check if bomb to be awarded.
  if (score > counter * AWARD) {
    counter++
    numOfBombs++
    bombDisplay.textContent = numOfBombs
    sound.award()
  }
}

const explosionEffect = (x, y, radius, color) => {
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
  window.removeEventListener('click', launchProjectile)
  window.removeEventListener('keyup', checkKeyboard)

  // stop animation when timeout.
  const id_5 = setTimeout(() => {
    clearTimeout(id_5)
    cancelAnimationFrame(animationID)
    clearInterval(timerID)

    bigScore.textContent = score
    modal.style.display = 'block'
  }, STOP_TIMING)
}

const animate = () => {
  animationID = requestAnimationFrame(animate)

  if (togglePause) return

  // with trailing:
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  // with no trailing:
  // c.clearRect(0, 0, canvas.width, canvas.height)  

  if (player) player.draw()

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) particles.splice(index, 1)
    else particle.update()
  })

  if (bomb) {
    if (bomb.radius < BOMB_RANGE) bomb.update()
    else bomb = null
  }

  projectiles.forEach((projectile, index) => {
    projectile.update()

    // remove projectiles reached out of screen.
    if (projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height) {
      const id_1 = setTimeout(() => {
        clearTimeout(id_1)
        projectiles.splice(index, 1)
      })
    }
  })

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update()

    if (player) {
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

      // collision between player and enemy.
      if (dist - enemy.radius - player.radius < 1) {
        // create explosion and kill player.
        sound.demolition()
        explosionEffect(player.x, player.y, player.radius * 10, player.color)
        player = null
        endGame()
      }

      if (bomb) {
        // collision between bomb and enemy.
        if (dist - enemy.radius - bomb.radius < 1) {
          // create explosion effect.
          explosionEffect(enemy.x, enemy.y, enemy.radius, enemy.color)
          // remove enemy, play sound.
          const id_4 = setTimeout(() => {
            clearTimeout(id_4)
            sound.explosion()
            enemies.splice(enemyIndex, 1)
          })
        }
      }
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      // collision between enemy and projectile.
      if (dist - enemy.radius - projectile.radius < 1) {
        // play sound and remove projectile.
        const id_2 = setTimeout(() => {
          clearTimeout(id_2)
          sound.explosion()
          projectiles.splice(projectileIndex, 1)
        })

        // create explosion effect.
        explosionEffect(projectile.x, projectile.y, enemy.radius, enemy.color)

        if (enemy.radius - 10 > 5) {
          // increase score.
          scoreManager(SCORE_HIT)
          // shrink enemy.
          gsap.to(enemy, { radius: enemy.radius - 10 })
        } else {
          // increase score.
          scoreManager(SCORE_KILL)
          // remove enemy.
          const id_3 = setTimeout(() => {
            clearTimeout(id_3)
            enemies.splice(enemyIndex, 1)
          })
        }
      }
    })
  })
}

const releaseBomb = () => {
  if (!numOfBombs) return

  numOfBombs--
  bombDisplay.textContent = numOfBombs
  bomb = new Bomb(CENTER_X, CENTER_Y, 10, 'red', 10)
  sound.release()
}

const launchProjectile = (event) => {
  if (togglePause) return

  const angle = Math.atan2(event.clientY - CENTER_Y, event.clientX - CENTER_X)
  const velocity = {
    x: Math.cos(angle) * SPEED_RATIO,
    y: Math.sin(angle) * SPEED_RATIO
  }
  // for each mouse click a new projectile launched.
  projectiles.push(new Projectile(CENTER_X, CENTER_Y, 5, 'white', velocity))
}

const checkKeyboard = (event) => {
  // pressing ESCAPE toggles pause.
  if (event.code === 'Escape') togglePause = !togglePause
  if (togglePause) return
  // pressing SPACE a bomb is released only, if not existing yet.
  if (event.code === 'Space' && !bomb) releaseBomb()
}

const init = () => {
  player = new Player(CENTER_X, CENTER_Y, 10, 'white')
  projectiles = []
  enemies = []
  particles = []
  bomb = null

  score = 0
  counter = 1
  numOfBombs = 0
  togglePause = false
  scoreDisplay.textContent = score
  bombDisplay.textContent = numOfBombs

  window.addEventListener('click', launchProjectile)
  window.addEventListener('keyup', checkKeyboard)
}

// starter IIFE.
(() => {
  awardDisplay.textContent = AWARD

  // start game by clicking the button, hide modal.
  startGameButton.addEventListener('click', () => {
    sound.pop()
    modal.style.display = 'none'
    init()
    animate()
    createEnemy()
  })

})()
