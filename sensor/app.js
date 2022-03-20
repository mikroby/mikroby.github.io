'use strict'

// const sensorName = 'magnetometer'
const sensorName = 'accelerometer'

const named = document.querySelector('.sensor span')
const state = document.querySelector('.status span')
const xValue = document.querySelector('.x span')
const yValue = document.querySelector('.y span')
const zValue = document.querySelector('.z span')


const useSensor = () => {
  
  // let sensor = new Magnetometer({ frequency: 1 })
  let sensor = new Accelerometer({ frequency: 10 })

  sensor.addEventListener('reading', e => {
    xValue.textContent = sensor.x
    yValue.textContent = sensor.y
    zValue.textContent = sensor.z
  })
  sensor.addEventListener('error', event => {
    state.textContent = `${event.error.name}, ${event.error.message}`
  })

  sensor.start()
}


navigator.permissions.query({ name: sensorName })
  .then(result => {
    if (result.state === 'denied') {
      state.textContent = `Permission to use ${sensorName} sensor is denied.`
      return
    }
    
    named.textContent = sensorName
    // Use the sensor.
    useSensor()
  });

