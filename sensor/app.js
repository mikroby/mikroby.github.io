'use strict'

const sensors = ['magnetometer', 'accelerometer']
const sensorObject = {
  'magnetometer'() { return new Magnetometer({ frequency: 10 }) }
  ,
  'accelerometer'() { return new Accelerometer({ frequency: 10 }) }
}


const useSensor = (sensorName) => {
  const template = `
    <div class="container">
    <h1 class="sensor">Sensor : ${sensorName}</h1>
    <p class="status">Status : <span></span></p>  
    <p class="x">Value along X-axis : <span></span></p>
    <p class="y">Value along Y-axis : <span></span></p>
    <p class="z">Value along Z-axis : <span></span></p>
    </div>
    `

  document.body.insertAdjacentHTML('afterbegin', template)

  const state = document.querySelector('.status span')
  const xValue = document.querySelector('.x span')
  const yValue = document.querySelector('.y span')
  const zValue = document.querySelector('.z span')

  // create sensor object
  const sensor = sensorObject[sensorName]()

  sensor.addEventListener('reading', () => {
    xValue.textContent = sensor.x.toFixed(1)
    yValue.textContent = sensor.y.toFixed(1)
    zValue.textContent = sensor.z.toFixed(1)
  })

  sensor.addEventListener('error', event => {
    state.textContent = `${event.error.name}, ${event.error.message}`
  })

  sensor.start()
}

// starter IIFE
(() => sensors.forEach(sensorName => {
  navigator.permissions.query({ name: sensorName })
    .then(result => {

      // check wether sensor presents
      if (result.state === 'denied') {
        state.textContent = `Permission to use ${sensorName} sensor is denied.`
        return
      }

      // otherwise use the sensor.
      useSensor(sensorName)

    }).catch(error => console.warn(error))
})
)()