'use strict'

// const sensorName = 'magnetometer'
const sensorName = 'accelerometer'

const named = document.querySelector('.sensor span')
const state = document.querySelector('.status span')
const xValue = document.querySelector('.x span')
const yValue = document.querySelector('.y span')
const zValue = document.querySelector('.z span')


const useSensor = () => {
  
  // let sensor = new Magnetometer({ frequency: 10 })
  let sensor = new Accelerometer({ frequency: 10 })

  sensor.addEventListener('reading', e => {
    xValue.textContent = sensor.x.toFixed(2)
    yValue.textContent = sensor.y.toFixed(2)
    zValue.textContent = sensor.z.toFixed(2)
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

