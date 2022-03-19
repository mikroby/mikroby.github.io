'use strict'

// const sensorName = 'magnetometer'
const sensorName = 'accelerometer'

const statusText = document.querySelector('.status span')
const xValue = document.querySelector('.x span')
const yValue = document.querySelector('.y span')
const zValue = document.querySelector('.z span')


navigator.permissions.query({ name: sensorName })
  .then(result => {
    if (result.state === 'denied') {
      statusText.content = `Permission to use ${sensorName} sensor is denied.`
      return
    }
    // Use the sensor.

    // let sensor = new Magnetometer({ frequency: 1 })
    let sensor = new Accelerometer({ frequency: 1 })

    sensor.addEventListener('reading', e => {
      xValue.textContent = sensor.x
      yValue.textContent = sensor.y
      zValue.textContent = sensor.z
    })
    sensor.addEventListener('error', event => {
      statusText.textContent = `${event.error.name} ${event.error.message}`
    })

    sensor.start()
  });

