'use strict'

import { Player, Projectile, Enemy, Particle } from './classes.js'
export { c, friction }

const speedRatio = 5

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreDisplay = document.querySelector('#score')
const StartGameButton = document.querySelector('#StartButton')
const modal = document.querySelector('#modal')
const bigScore = document.querySelector('#bigScore')

const x = canvas.width / 2
const y = canvas.height / 2

const friction = 0.99

let player, projectiles, enemies, particles, score, animationId, timeId

// class definitions moved to separate file

function init() {
  player = new Player(x, y, 10, 'white')
  projectiles = []
  enemies = []
  particles = []
  score = 0
  scoreDisplay.textContent = score
}

function spawnEnemies() {
  timeId = setInterval(() => {
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

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

function animate() {
  animationId = requestAnimationFrame(animate)
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
      }, 0)
    }
  })

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update()

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

    // end game.
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
      clearInterval(timeId)
      bigScore.textContent = score
      modal.style.display = 'flex'
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      // collision between enemy and projectile
      if (dist - enemy.radius - projectile.radius < 1) {

        // create sound
        const id = setTimeout(() => {
          clearTimeout(id)
          new Audio('assets/explode.wav').play()
        }, 0)

        // create explosion effect
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color,
            { x: (Math.random() - 0.5) * (Math.random() * 6), y: (Math.random() - 0.5) * (Math.random() * 6) }))
        }

        if (enemy.radius - 10 > 5) {

          // increase score
          score += 100
          scoreDisplay.textContent = score

          // shrink enemy
          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          // remove projectile
          const id = setTimeout(() => {
            clearTimeout(id)
            projectiles.splice(projectileIndex, 1)
          }, 0)
        } else {
          // increase score
          score += 250
          scoreDisplay.textContent = score
          // remove enemy and projectile
          const id = setTimeout(() => {
            clearTimeout(id)
            enemies.splice(enemyIndex, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0)
        }
      }
    })
  })
}

// for each mouse click a new projectile launched
window.addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
  const velocity = {
    x: Math.cos(angle) * speedRatio,
    y: Math.sin(angle) * speedRatio
  }

  projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
})

// start game by clicking the button
StartGameButton.addEventListener('click', () => {
  init()
  modal.style.display = 'none'
  animate()
  spawnEnemies()
})
