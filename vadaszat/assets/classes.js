import { c, FRICTION } from './main.js'

export class Enemy {
  constructor(x, y, radius, color, velocity, worth) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.worth = worth
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}


export class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw();
    this.velocity.x *= FRICTION
    this.velocity.y *= FRICTION
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

export class CrossHair {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.moveTo(this.x, this.y - this.radius * 1.5)
    c.lineTo(this.x, this.y - this.radius / 2)
    c.moveTo(this.x, this.y + this.radius * 1.5)
    c.lineTo(this.x, this.y + this.radius / 2)
    c.moveTo(this.x - this.radius * 1.5, this.y)
    c.lineTo(this.x - this.radius / 2, this.y)
    c.moveTo(this.x + this.radius * 1.5, this.y)
    c.lineTo(this.x + this.radius / 2, this.y)
    c.strokeStyle = this.color
    c.stroke()
  }
}
