"use strict";

import {
  shipMark,
  shootMark,
  shipsToAccomodate,
  maxCell,
  maxShots,
  sounds,
} from "./config.js";
import { hideShips } from "./hideShips.js";

const header = document.querySelector("header");
const field = document.querySelector("#field");
const message = document.querySelector("#message");
const shotNumber = document.querySelector("#shotNumber");
const hitNumber = document.querySelector("#hitNumber");
const sunkNumber = document.querySelector("#sunkNumber");
const button = document.querySelector("#game_control");

let cells, shots, hits, sunks, ships;

const initialize = () => {
  button.textContent = "A játék leírása";
  button.onclick = () => (window.location = "#playRules");
  message.textContent = "";

  cells.forEach((cell) => {
    cell.addEventListener("click", shootCallback, { once: true });
    cell.innerHTML = "";
    cell.className = "cell";
  });
  shots = maxShots;
  hits = 0;
  sunks = 0;
};

const report = () => {
  shotNumber.textContent = shots;
  hitNumber.textContent = hits;
  sunkNumber.textContent = sunks;
};

const playSound = (name) => {
  const { url, volume } = sounds[name];
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play();
};

const hit = (cell) => {
  animateField();
  playSound("hit");
  hits++;
  cell.classList.add("hit");
  cell.innerHTML = shipMark;
  message.textContent = "Talált!";
};

const missed = (cell) => {
  animateHeader();
  playSound("missed");
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
  playSound("sunk");
  sunks++;
  ship.forEach((cell) => cell.classList.replace("hit", "sunk"));
  message.textContent = "Talált, Süllyedt!";
};

const checkForSunk = () =>
  ships.forEach((ship) => {
    if (ship.every((cell) => cell.classList.contains("hit"))) {
      sunk(ship);
    }
  });

const showAliveShips = () => {
  ships.flat().forEach((cell) => {
    if (cell.className === "cell") {
      cell.classList.add("alive");
      cell.innerHTML = shipMark;
    }
  });
};

const theEnd = () => {
  document.querySelectorAll(".cell:not(.shot)").forEach((cell) => {
    cell.removeEventListener("click", shootCallback);
    cell.classList.add("shot");
  });

  button.textContent = "Új játék";
  button.onclick = start;
};

const checkEnd = () => {
  if (shots === 0) {
    message.textContent = "Elfogyott a lőszer...";
    showAliveShips();
    theEnd();
  }
  if (sunks === shipsToAccomodate.length) {
    message.textContent = "Minden hajó elsüllyedt!";
    theEnd();
  }
};

const shootCallback = (event) => shoot(event.target);

const shoot = (cell) => {
  shots--;
  cell.classList.add("shot");
  evaluateShot(cell);
  checkForSunk();
  report();
  checkEnd();
};

const animateHeader = () => {
  header.classList.add("shock-header");
  const id = setTimeout(() => {
    clearTimeout(id);
    header.classList.toggle("shock-header");
  }, 510);
};

const animateField = () => {
  field.classList.add("shock-field");
  const id = setTimeout(() => {
    clearTimeout(id);
    field.classList.toggle("shock-field");
  }, 410);
};

const start = () => {
  initialize();
  report();
  ships = hideShips();
};

const createField = () => {
  const template = [];
  for (let y = 0; y < maxCell; y++) {
    template.push(`<div class="row" data-y="${y}">`);
    for (let x = 0; x < maxCell; x++) {
      template.push(`<div class="cell" data-x="${x}"></div>`);
    }
    template.push(`</div>`);
  }
  field.innerHTML = template.join("");
};

// IIFE starter. run on page load or on refresh.
(() => {
  createField();
  cells = document.querySelectorAll(".cell");
  start();
})();
