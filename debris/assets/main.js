'use strict'

import { Player, Projectile, Enemy, Particle, Bomb } from './classes.js'
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
const AWARD = 2000
const SOUND_PATH = 'assets/explode.wav'

// game variables
let player, projectiles, enemies, particles, bomb,
  score, counter, bombs,
  animationId, timeId,
  togglePause

const init = () => {
  player = new Player(CENTER_X, CENTER_Y, 10, 'white')
  projectiles = []
  enemies = []
  particles = []
  bomb = null
  score = 0
  counter = 1
  bombs = 0
  togglePause = false
  scoreDisplay.textContent = score
  bombDisplay.textContent = bombs
}

const explosionNoise = () => {
  new Audio(SOUND_PATH).play()
}

const createEnemies = () => {
  timeId = setInterval(() => {

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
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

const checkBombAward = () => {
  if (score > counter * AWARD) {
    counter++
    bombs++
    bombDisplay.textContent = bombs
  }
}

const endGame = () => {
  cancelAnimationFrame(animationId)
  clearInterval(timeId)

  bigScore.textContent = score
  modal.style.display = 'block'
}

const animate = () => { 
  animationId = requestAnimationFrame(animate)

  if (togglePause) return

  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  // c.clearRect(0, 0, canvas.width, canvas.height)
  c.fillRect(0, 0, canvas.width, canvas.height)

  player.draw()

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
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
      projectile.y - projectile.radius > canvas.height
    ) {
      const id = setTimeout(() => {
        clearTimeout(id)
        projectiles.splice(index, 1)
      })
    }
  })

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update()

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

    if (bomb) {
      if (dist - enemy.radius - bomb.radius < 1) killEnemyByBomb(enemy, enemyIndex)
    }

    // end game, reveal modal.
    if (dist - enemy.radius - player.radius < 1) endGame()

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      // collision between enemy and projectile
      if (dist - enemy.radius - projectile.radius < 1) {

        // create sound
        const id = setTimeout(() => {
          clearTimeout(id)
          explosionNoise()
        })

        // create explosion effect
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color,
            { x: (Math.random() - 0.5) * (Math.random() * 6), y: (Math.random() - 0.5) * (Math.random() * 6) }))
        }

        if (enemy.radius - 10 > 5) {

          // increase score
          score += 100
          scoreDisplay.textContent = score
          checkBombAward()

          // shrink enemy
          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          // remove projectile
          const id = setTimeout(() => {
            clearTimeout(id)
            projectiles.splice(projectileIndex, 1)
          })
        } else {
          // increase score
          score += 250
          scoreDisplay.textContent = score
          checkBombAward()
          // remove enemy and projectile
          const id = setTimeout(() => {
            clearTimeout(id)
            enemies.splice(enemyIndex, 1)
            projectiles.splice(projectileIndex, 1)
          })
        }
      }
    })
  })  
}

const killEnemyByBomb = (enemy, enemyIndex) => {
  // increase score
  score += 250
  scoreDisplay.textContent = score
  checkBombAward()

  // create explosion effect
  for (let i = 0; i < enemy.radius * 2; i++) {
    particles.push(new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color,
      { x: (Math.random() - 0.5) * (Math.random() * 6), y: (Math.random() - 0.5) * (Math.random() * 6) }))
  }

  // remove enemy create sound
  const id = setTimeout(() => {
    clearTimeout(id)
    explosionNoise()
    enemies.splice(enemyIndex, 1)
  })
}

// for each mouse click a new projectile launched
window.addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - CENTER_Y, event.clientX - CENTER_X)
  const velocity = {
    x: Math.cos(angle) * SPEED_RATIO,
    y: Math.sin(angle) * SPEED_RATIO
  }

  projectiles.push(new Projectile(CENTER_X, CENTER_Y, 5, 'white', velocity))
})

const releaseBomb = () => {
  if (!bombs) return
  bombs--
  bombDisplay.textContent = bombs
  bomb = new Bomb(CENTER_X, CENTER_Y, 10, 'red', 10)
}

// pressing SPACE a bomb is launched only, if not existing yet.
window.addEventListener('keyup', (event) => {
  if (togglePause) return
  if (event.code === 'Space' && !bomb) releaseBomb()
})

// pressing ESCAPE toggles pause.
window.addEventListener('keyup', (event) => {
  if (event.code === 'Escape') togglePause = !togglePause
})

// start game by clicking the button, hide modal.
startGameButton.addEventListener('click', () => {
  modal.style.display = 'none'
  init()
  animate()
  createEnemies()
});

(() => awardDisplay.textContent = AWARD)()
