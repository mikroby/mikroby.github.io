'use strict'

import { Enemy, Particle, CrossHair } from './classes.js'
import sound from './sounds.js'
import CNST from './game_constants.js'
import { c, canvas, CENTER_X, CENTER_Y } from './dom.js'
import DOM from './dom.js'

// game variables:
let enemies, particles, crossHair,
  score, counter, numOfBullets,
  togglePause, shootTrigger,
  animationID, timerID

const display = {
  enemy() { DOM.enemyDisplay.textContent = enemies.length },
  score() { DOM.scoreDisplay.textContent = score },
  bullet() { DOM.bulletDisplay.textContent = numOfBullets },
  allInfo() { this.enemy(); this.score(); this.bullet() },
  bigScore() { DOM.bigScore.textContent = score },
  descInfo() {
    DOM.award.textContent = CNST.AWARD_POINT
    DOM.bullet.textContent = CNST.AWARD_BULLETS
  }
}

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

    if (enemies.length < CNST.MAX_ENEMY) {
      enemies.push(new Enemy(x, y, radius, color, velocity, speedRatio))
      display.enemy()
    }
  }, CNST.ENEMY_TIMING)
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
  // no user action allowed.
  window.removeEventListener('click', shoot)
  window.removeEventListener('keyup', checkKeyboard)
  window.removeEventListener('mousemove', moveCrossHair)

  // stop animation and show modal when timeout.
  const id = setTimeout(() => {
    clearTimeout(id)
    cancelAnimationFrame(animationID)
    clearInterval(timerID)

    display.bigScore()
    DOM.showModal()
    DOM.showCursor()
  }, CNST.STOP_TIMING)
}

const scoreManager = (increment) => {
  score += increment
  display.score()

  // check if bullets to be awarded.
  if (score > counter * CNST.AWARD_POINT) {
    counter++
    numOfBullets += CNST.AWARD_BULLETS
    display.bullet()
    sound.award()
  }
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

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) particles.splice(index, 1)
    else particle.update()
  })

  enemies.forEach((enemy, index) => {
    enemy.update()

    // check hit if shoot triggered.
    if (shootTrigger) {
      const dist = Math.hypot(crossHair.x - enemy.x, crossHair.y - enemy.y)

      // enemy in the cross-hair within precision.
      if (dist - enemy.radius - crossHair.radius < CNST.PRECISION) {
        // play sound.
        sound.explosion()
        // create explosion effect.
        createParticles(enemy.x, enemy.y, enemy.radius, enemy.color)

        if (enemy.radius - 10 > 5) {
          // increase score.
          scoreManager(CNST.SCORE_HIT * enemy.worth)
          // shrink enemy.
          gsap.to(enemy, { radius: enemy.radius - 10 })
        } else {
          // increase score.
          scoreManager(CNST.SCORE_KILL * enemy.worth)
          // remove enemy.
          const id_1 = setTimeout(() => {
            clearTimeout(id_1)
            enemies.splice(index, 1)
            display.enemy()
          })
        }
      }
    }

    // check if enemy is out of screen.
    if (enemy.x + enemy.radius < 0 ||
      enemy.x - enemy.radius > canvas.width ||
      enemy.y + enemy.radius < 0 ||
      enemy.y - enemy.radius > canvas.height) {
      const id_2 = setTimeout(() => {
        clearTimeout(id_2)
        enemies.splice(index, 1)
        display.enemy()
      })
    }

  })

  if (shootTrigger) {
    shootTrigger = false
    if (!numOfBullets) endGame()
  }

  crossHair.draw()
}

const shoot = () => {
  if (togglePause) return

  numOfBullets--
  display.bullet()
  sound.shoot()
  shootTrigger = true
}

const checkKeyboard = (event) => {
  // pressing ESCAPE toggles pause.
  if (event.code === 'Escape') togglePause = !togglePause
  if (togglePause) return
  // pressing SPACE. not needed.
  // if (event.code === 'Space') xyz()
}

const moveCrossHair = (event) => {
  crossHair.x = event.clientX
  crossHair.y = event.clientY
}

const init = (event) => {
  crossHair = new CrossHair
    (event.clientX, event.clientY, CNST.CROSSHAIR_RADIUS, CNST.CROSSHAIR_COLOR)
  enemies = []
  particles = []

  score = 0
  counter = 1
  numOfBullets = CNST.START_BULLETS
  shootTrigger = false
  togglePause = false

  // user action allowed.
  const id = setTimeout(() => {
    clearTimeout(id)
    window.addEventListener('click', shoot)
    window.addEventListener('keyup', checkKeyboard)
    window.addEventListener('mousemove', moveCrossHair)
  }, CNST.START_TIMING)
}

// starter IIFE.
(() => {
  display.descInfo()

  // start game by clicking the button, hide modal.
  DOM.startButton.addEventListener('click', (event) => {
    DOM.hideCursor()
    DOM.hideModal()
    init(event)
    display.allInfo()
    sound.pop()
    animate()
    createEnemy()
  })

})()
