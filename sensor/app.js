'use strict'

const sensors = [
  'accelerometer', 'proximity', 'gyroscope', 'magnetometer',
  'ambient-light-sensor',
]
const sensorObject = {
  'magnetometer'() { return new Magnetometer({ frequency: 5 }) }
  ,
  'accelerometer'() { return new Accelerometer({ frequency: 10 }) }
  ,
  'gyroscope'() { return new Gyroscope({ frequency: 10 }) }
  ,
  'proximity'() { return new ProximitySensor({ frequency: 5 }) }
  ,
  'ambient-light-sensor'() { return new AmbientLightSensor({ frequency: 5 }) }
}


const useSensor = (sensorName, index, result) => {
  const template = `
    <div class="container">
    <h2 class="sensor">${index}. Sensor : ${sensorName}</h2>
    <small>${result}</small>
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
    switch (sensorName) {
      case 'ambient-light-sensor':
        xValue.textContent = sensor.illuminance.toFixed(2)
        break
      case 'accelerometer':
      case 'magnetometer':
        xValue.textContent = sensor.x.toFixed(1)
        yValue.textContent = sensor.y.toFixed(1)
        zValue.textContent = sensor.z.toFixed(1)
        break
      case 'proximity':
        xValue.textContent = sensor.distance.toFixed(2)
        break
    }
  })

  sensor.addEventListener('error', event => {
    state.textContent = `${event.error.name}, ${event.error.message}`
  })

  sensor.start()
}

// starter IIFE
(() => sensors.forEach((sensorName, index) => {

  console.log(`${index + 1}. ${sensorName}`)

  navigator.permissions.query({ name: sensorName })
    .then(result => {
      // check whether sensor allowed: "denied" | "granted" | "prompt".
      if (result.state === 'denied') {
        console.warn(`Permission to use ${sensorName} sensor is denied.`)
      } else {
        // otherwise use the sensor.
        useSensor(sensorName, index + 1, result.state)
      }

    }).catch(error => console.warn(`Handled ERROR on ${sensorName}:`, error))
})
)()