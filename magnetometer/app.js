'use strict'

const sensor = 'magnetometer'
// const sensor = 'accelerometer'

const statusText = document.querySelector('.status span')
const xValue = document.querySelector('.x span')
const yValue = document.querySelector('.y span')
const zValue = document.querySelector('.z span')


const defineSensor = () => {
  let magSensor = new Magnetometer({ frequency: 1 })

  magSensor.addEventListener('reading', e => {
    xValue.textContent = magSensor.x
    yValue.textContent = magSensor.y
    zValue.textContent = magSensor.z
  })
  magSensor.addEventListener('error', event => {
    statusText.textContent = `${event.error.name} ${event.error.message}`
  })
}


navigator.permissions.query({ name: sensor })
  .then(result => {
    if (result.state === 'denied') {
      statusText.content = `Permission to use ${sensor} sensor is denied.`
      return
    }
    // Use the sensor.
    defineSensor()
    magSensor.start()
  });

 