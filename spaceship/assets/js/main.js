'use strict'

import display from "./display.js"
import CNST from "./game_constants.js"


const changeUserActions = (action) => {
  window[`${action}EventListener`]('click', shoot)
  window[`${action}EventListener`]('keyup', checkKeyboard)
  window[`${action}EventListener`]('mousemove', moveCrossHair)
}

// starter IIFE
(() => {
  // right mouse button disabled.
  window.addEventListener('contextmenu', (event) => event.preventDefault())

  display.earth.addEventListener('click', () => {
    display.hideBoxes()
    display.setEarthDiameter(CNST.EARTH_RADIUS * 2)   
  })

})()
