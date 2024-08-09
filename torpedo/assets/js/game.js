"use strict";

import {
  shipMark,
  shootMark,
  shipsToAccomodate,
  maxCell,
  maxShots,
  sounds,
  texts,
} from "./config.js";
import { hideShips } from "./hideShips.js";
import { playSound } from "./helpers.js";
import {
  header,
  board,
  message,
  shotNumber,
  hitNumber,
  sunkNumber,
  button,
} from "./app.js";

let language, cells, shots, hits, sunks, ships;

const animateHeader = () => {
  header.classList.add("sway");
  const id = setTimeout(() => {
    clearTimeout(id);
    header.classList.toggle("sway");
  }, 510);
};

const animateBoard = () => {
  board.classList.add("blast");
  const id = setTimeout(() => {
    clearTimeout(id);
    board.classList.toggle("blast");
  }, 410);
};

const report = () => {
  shotNumber.textContent = shots;
  hitNumber.textContent = hits;
  sunkNumber.textContent = sunks;
};

const hit = (cell) => {
  animateBoard();
  playSound(sounds.hit);
  hits++;
  cell.classList.add("hit");
  cell.innerHTML = shipMark;
  message.textContent = texts[language].hit;
};

const missed = (cell) => {
  animateHeader();
  playSound(sounds.missed);
  cell.classList.add("missed");
  cell.innerHTML = shootMark;
  message.textContent = "";
};

const evaluateShot = (cell) => {
  if (ships.flat().includes(cell)) {
    hit(cell);
  } else {
    missed(cell);
  }
};

const sunk = (ship) => {
  playSound(sounds.sunk);
  sunks++;
  shots++;
  ship.forEach((cell) => cell.classList.replace("hit", "sunk"));
  message.textContent = texts[language].sunk;
};

const checkForSunk = () =>
  ships.forEach((ship) => {
    if (ship.every((cell) => cell.classList.contains("hit"))) {
      sunk(ship);
    }
  });

const revealAliveShips = () => {
  ships.flat().forEach((cell) => {
    if (cell.className === "cell") {
      cell.classList.add("alive");
      cell.innerHTML = shipMark;
    }
  });
};

const theEnd = () => {
  document.querySelectorAll(".cell:not(.shot)").forEach((cell) => {
    cell.removeEventListener("click", clickHandlerCallback);
    cell.classList.add("shot");
  });

  button.textContent = texts[language].newGame;
  button.onclick = startNewGame;
};

const checkEnd = () => {
  if (shots === 0) {
    message.textContent = texts[language].lost;
    revealAliveShips();
    theEnd();
  }
  if (sunks === shipsToAccomodate.length) {
    message.textContent = texts[language].won;
    theEnd();
  }
};

const clickHandlerCallback = (event) => shoot(event.target);

const shoot = (cell) => {
  shots--;
  cell.classList.add("shot");
  evaluateShot(cell);
  checkForSunk();
  report();
  checkEnd();
};

const initialize = () => {
  button.textContent = texts[language].instructions;
  button.onclick = () => (window.location = "#instructions_page");
  message.textContent = "";

  cells.forEach((cell) => {
    cell.addEventListener("click", clickHandlerCallback, { once: true });
    cell.innerHTML = "";
    cell.className = "cell";
  });

  shots = maxShots;
  hits = 0;
  sunks = 0;
};

const startNewGame = () => {
  initialize();
  report();
  ships = hideShips(shipsToAccomodate);
};

const createBoard = () => {
  const template = [];
  for (let y = 0; y < maxCell; y++) {
    template.push(`<div class="row" data-y="${y}">`);
    for (let x = 0; x < maxCell; x++) {
      template.push(`<div class="cell" data-x="${x}"></div>`);
    }
    template.push(`</div>`);
  }

  board.insertAdjacentHTML("afterbegin", template.join(""));
};

export const startFirstGame = () => {
  createBoard();
  cells = document.querySelectorAll(".cell");
  startNewGame();
};

export const setLanguage = (newLanguage) => (language = newLanguage);
