'use strict'

const sensors = ['accelerometer', 'magnetometer']
const sensorObject = {
  'magnetometer'() { return new Magnetometer({ frequency: 10 }) }
  ,
  'accelerometer'() { return new Accelerometer({ frequency: 10 }) }
}


const useSensor = (sensorName, index) => {
  const template = `
    <div class="container">
    <h1 class="sensor">${index}. Sensor : ${sensorName}</h1>
    <p class="status index${index}">Status : <span></span></p>  
    <p class="x index${index}">Value along X-axis : <span></span></p>
    <p class="y index${index}">Value along Y-axis : <span></span></p>
    <p class="z index${index}">Value along Z-axis : <span></span></p>    
    </div>
    `

  document.body.insertAdjacentHTML('beforeend', template)

  const state = document.querySelector(`.status.index${index} span`)
  const xValue = document.querySelector(`.x.index${index} span`)
  const yValue = document.querySelector(`.y.index${index} span`)
  const zValue = document.querySelector(`.z.index${index} span`)

  
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
(() => sensors.forEach((sensorName, index) => {
  navigator.permissions.query({ name: sensorName })
    .then(result => {

      // check whether sensor presents
      if (result.state === 'denied') {
        console.warn(`Permission to use ${sensorName} sensor is denied.`)
        return
      }

      // otherwise use the sensor.
      useSensor(sensorName, index + 1)

    }).catch(error => console.warn(error))
})
)()