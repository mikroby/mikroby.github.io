'use strict';
import { moves, neighbors } from "./graphs.js"

const header = document.querySelector('#game__header');
const infoBox = document.querySelector('.infoBox');
const pegNumber = document.querySelector('#pegNumber');
const button = document.querySelector('#toText');
const fieldPattern = [3, 3, 7, 7, 7, 3, 3]
let cells, firstMove, timerId


const animateHeader = () => {
  header.classList.add('shock-header')
  const id = setTimeout(() => {
    clearTimeout(id)
    header.classList.toggle('shock-header')
  }, 510)
}

const blinkInfo = () => {  
  timerId = setTimeout(() => {
    clearTimeout(timerId)
    infoBox.classList.remove('blinkInfo')
  }, 1500)
}

const createField = () => {
  const template = []
  let from = 0

  for (let row = 0; row < fieldPattern.length; row++) {
    template.push(`<div class="row">`)

    for (let cell = from; cell < from + fieldPattern[row]; cell++) {
      template.push(`<div class="cell" data-cell="${cell}"></div>`)
    }

    from += fieldPattern[row]

    template.push(`</div>`)
  }

  document.querySelector('.field').innerHTML = template.join('')
}

const initialize = () => {
  cells.forEach(cell => {
    cell.classList.remove('occupied', 'empty')
    cell.dataset.cell === '16' ? cell.classList.add('empty') : cell.classList.add('occupied')
  })

  button.textContent = 'A játék leírása'
  button.onclick = function () { window.location = "#playRules" }
  infoBox.textContent = 'Jelölj ki egy követ!'
  firstMove = true
}

function take() {
  const taken = document.querySelector('.taken')

  if (taken) taken.classList.replace('taken', 'moveable')

  document.querySelectorAll('.transposable').forEach(cell => {
    cell.classList.remove('transposable')
    cell.removeEventListener('click', transpose)
  })

  this.classList.replace('moveable', 'taken')

  markTransposables(this)
}

const markTransposables = (taken) => {
  moves[taken.dataset.cell]
    .filter(position => cells[position].classList.contains('empty'))
    .filter(position => cells[commonNeighbor(taken.dataset.cell, position)]
      .classList.contains('occupied'))
    .forEach(position => {
      cells[position].classList.toggle('transposable')
      cells[position].addEventListener('click', transpose)
    })
}

function transpose() {
  if (firstMove) {
    firstMove = false
    button.textContent = 'Újrakezdés'
    button.onclick = start
  }

  const next = this.dataset.cell
  const taken = document.querySelector('.taken')
  const current = taken.dataset.cell

  // removes the overtaken peg
  cells[commonNeighbor(current, next)].classList.replace('occupied', 'empty')

  this.classList.replace('empty', 'occupied')
  taken.classList.replace('occupied', 'empty')

  animateHeader()
  cleanup()
  checkEnd()
}

const showInfo = (info) => {
  pegNumber.textContent = info
}

const checkEnd = () => {
  const pegs = document.querySelectorAll('.occupied').length
  showInfo(pegs)

  infoBox.classList.add('blinkInfo')

  if (pegs === 1) {
    theEnd('Megnyerted a játékot!')
    return
  }

  if (markMoveables() === 0) {
    theEnd('Vége a játéknak!')
    return
  }

  blinkInfo()
}

const theEnd = (text) => {
  clearTimeout(timerId)
  infoBox.textContent = text
  button.textContent = 'Új játék';
  button.onclick = start;
}

const cleanup = () =>
  cells.forEach(cell => {
    cell.removeEventListener('click', transpose)
    cell.removeEventListener('click', take)
    cell.classList.remove('transposable', 'moveable', 'taken')
  })

const markMoveables = () => {
  const allPosition = getAllPosition()
  allPosition.forEach(position => {
    cells[position].classList.add('moveable')
    cells[position].addEventListener('click', take)
  })

  return allPosition.length
}

const commonNeighbor = (first, second) => {
  return neighbors[first].filter(neighborOfFirst => neighbors[second].includes(neighborOfFirst))[0]
}

const getAllPosition = () => {
  const positions = []
  document.querySelectorAll('.empty')
    .forEach(empty =>
      positions.push(moves[empty.dataset.cell]
        .filter(position => cells[position].classList.contains('occupied'))
        .filter(position => cells[commonNeighbor(empty.dataset.cell, position)].classList.contains('occupied'))
      )
    )
  // removes duplicated positions
  return [...new Set(positions.flat())]
}

const start = () => {
  initialize()
  cleanup()
  checkEnd()
}


// IIFE starter.
(() => {
  createField()
  cells = document.querySelectorAll('.cell')
  start()
})()

// for testing graph objects:
// tester()
// function tester() {
//   initialize()
//   cells.forEach(cell => cell.addEventListener('click', toggleColor))
// }
// function toggleColor() {
//   neighbors[this.dataset.cell].forEach(position =>
//     cells[position].classList.toggle('transposable'))

//   moves[this.dataset.cell].forEach(position =>
//     cells[position].classList.toggle('moveable'))
// }