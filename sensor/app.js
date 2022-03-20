'use strict'

const sensorObject = {
  'magnetometer'() { return new Magnetometer({ frequency: 10 }) }
  ,
  'accelerometer'() { return new Accelerometer({ frequency: 10 }) }
}

const sensors = ['magnetometer', 'accelerometer']

const named = document.querySelector('.sensor span')
const state = document.querySelector('.status span')
const xValue = document.querySelector('.x span')
const yValue = document.querySelector('.y span')
const zValue = document.querySelector('.z span')


const useSensor = (sensorName) => {

  named.textContent = sensorName

  const sensor = sensorObject[sensorName]()

  sensor.addEventListener('reading', e => {
    xValue.textContent = sensor.x.toFixed(1)
    yValue.textContent = sensor.y.toFixed(1)
    zValue.textContent = sensor.z.toFixed(1)
  })
  sensor.addEventListener('error', event => {
    state.textContent = `${event.error.name}, ${event.error.message}`
  })

  sensor.start()
}

sensors.forEach(sensorName => {

  navigator.permissions.query({ name: sensorName })
    .then(result => {
      if (result.state === 'denied') {
        state.textContent = `Permission to use ${sensorName} sensor is denied.`
        return
      }

      // Use the sensor.
      useSensor(sensorName)

    }).catch(error => console.warn(error))

})

