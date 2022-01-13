'use strict';

import { hideShips } from "./hideShips.js"

const shipMark = '<i class="fas fa-square"></i>';
const shootMark = '<i class="fas fa-times"></i>';

const header = document.querySelector('#game__header');
const info = document.querySelector('#info');
const shotNumber = document.querySelector('#shotNumber');
const hitNumber = document.querySelector('#hitNumber');
const sunkNumber = document.querySelector('#sunkNumber');
const button = document.querySelector('.btn');
const field = document.querySelector('.field');

const shipsToLocate = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
const maxCell = 10;
const maxShots = 40;
let cells,shots, hits, sunks, ships;


const initialize = () => {
  button.textContent = 'A játék leírása';
  button.onclick = function () { window.location = "#playRules" };
  info.textContent = '';

  cells.forEach(cell => {
    cell.addEventListener('click', shoot);
    cell.innerHTML = '';
    cell.className = 'cell';
  });
  shots = maxShots;
  hits = 0;
  sunks = 0;
}

const showInfo = () => {
  shotNumber.textContent = shots;
  hitNumber.textContent = hits;
  sunkNumber.textContent = sunks;
}

const hit = (cell) => {
  animateField();
  const hitSound = new Audio('assets/sound/hit.wav');
  hitSound.volume = 0.5;
  hitSound.play();
  hits++;
  cell.classList.add('hit');
  cell.innerHTML = shipMark;
  info.textContent = 'Talált!';
}

const missed = (cell) => {
  new Audio('assets/sound/missed.wav').play();
  animateHeader();
  cell.classList.add('missed');
  cell.innerHTML = shootMark;
  info.textContent = '';
}

const evaluateShot = (cell) => {
  if (ships.flat().includes(cell)) { hit(cell) }
  else { missed(cell) };
}

const sunk = (ship) => {
  new Audio('assets/sound/sunk.wav').play();
  sunks++;
  ship.forEach(cell => cell.classList.replace('hit', 'sunk'));
  info.textContent = 'Talált, Süllyedt!';
}

const checkSunk = () => {
  ships.forEach(ship => {
    if (ship.every(cell => cell.classList.contains('hit'))) {
      sunk(ship);
    }
  })
}

const showAliveShips = () => {
  ships.flat().forEach(cell => {
    if (cell.className === 'cell') {
      cell.classList.add('alive');
      cell.innerHTML = shipMark;
    }
  });
}

const theEnd = () => {
  document.querySelectorAll('.cell:not(.shot)').forEach(cell => {
    cell.removeEventListener('click', shoot);
    cell.classList.add('shot');
  })

  button.textContent = 'Új játék';
  button.onclick = start;
}

const checkEnd = () => {
  if (shots === 0) {
    info.textContent = 'Elfogyott a lőszer...';
    showAliveShips();
    theEnd();
  }
  if (sunks === shipsToLocate.length) {
    info.textContent = 'Minden hajó elsüllyedt!';
    theEnd();
  }
}

function shoot() {
  shots--;
  this.removeEventListener('click', shoot);
  this.classList.add('shot');
  evaluateShot(this);
  checkSunk();
  showInfo();
  checkEnd();
}

const animateHeader = () => {
  header.classList.add('shock-header');
  const id = setTimeout(() => {
    clearTimeout(id);
    header.classList.toggle('shock-header');
  }, 510);
}

const animateField = () => {
  field.classList.add('shock-field');
  const id = setTimeout(() => {
    clearTimeout(id);
    field.classList.toggle('shock-field');
  }, 410);
}

const start = () => {
  initialize();
  showInfo();
  ships = hideShips();
}

const createField = () => {
  let template = [];
  for (let y = 0; y < maxCell; y++) {
    template.push(`<div class="row" data-y="${y}">`);
    for (let x = 0; x < maxCell; x++) {
      template.push(`<div class="cell" data-x="${x}"></div>`);
    }
    template.push(`</div>`);
  }
  field.innerHTML = template.join('');
}

// IIFE starter.
(() => {
  createField();
  cells = document.querySelectorAll('.cell');
  start();
})();

export { shipsToLocate, maxCell };