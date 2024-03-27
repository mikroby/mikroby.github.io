"use strict";

import { Board } from "./board.js";
import { Goose } from "./goose.js";
import { Fox } from "./fox.js";

const header = document.querySelector("#game__header");
const infoBox = document.querySelector(".infoBox");
const pegNumber = document.querySelector("#pegNumber");
const button = document.querySelector("#toText");
let cells, firstMove, timerId;

const animateHeader = () => {
  header.classList.add("shock-header");
  const id = setTimeout(() => {
    clearTimeout(id);
    header.classList.toggle("shock-header");
  }, 510);
};

const blinkInfo = () => {
  timerId = setTimeout(() => {
    clearTimeout(timerId);
    infoBox.classList.remove("blinkInfo");
  }, 1500);
};

const initialize = () => {
  button.textContent = "A játék leírása";
  button.onclick = () => {
    window.location = "#playRules";
  };
  infoBox.textContent = "Jelölj ki egy libát!";
  firstMove = true;
};

const markTransposables = (taken) => {
  moves[taken.dataset.cell]
    .filter((position) => cells[position].classList.contains("empty"))
    .filter((position) =>
      cells[commonNeighbor(taken.dataset.cell, position)].classList.contains(
        "occupied"
      )
    )
    .forEach((position) => {
      cells[position].classList.toggle("transposable");
      cells[position].addEventListener("click", transpose);
    });
};

function transpose() {
  if (firstMove) {
    firstMove = false;
    button.textContent = "Újrakezdés";
    button.onclick = start;
  }

  const next = this.dataset.cell;
  const taken = document.querySelector(".taken");
  const current = taken.dataset.cell;

  // removes the overtaken peg
  cells[commonNeighbor(current, next)].classList.replace("occupied", "empty");

  this.classList.replace("empty", "occupied");
  taken.classList.replace("occupied", "empty");

  animateHeader();
  cleanup();
  checkEnd();
}

const showInfo = (info) => {
  pegNumber.textContent = info;
};

const checkEnd = () => {
  const pegs = document.querySelectorAll(".occupied").length;
  showInfo(pegs);

  infoBox.classList.add("blinkInfo");

  if (pegs === 1) {
    theEnd("Megnyerted a játékot!");
    return;
  }

  if (markMoveables() === 0) {
    theEnd("Vége a játéknak!");
    return;
  }

  blinkInfo();
};

const theEnd = (text) => {
  clearTimeout(timerId);
  infoBox.textContent = text;
  button.textContent = "Új játék";
  button.onclick = start;
};

const cleanup = () =>
  cells.forEach((cell) => {
    cell.removeEventListener("click", transpose);
    cell.removeEventListener("click", take);
    cell.classList.remove("transposable", "moveable", "taken");
  });

const commonNeighbor = (first, second) => {
  return neighbors[first].filter((neighborOfFirst) =>
    neighbors[second].includes(neighborOfFirst)
  )[0];
};

const getAllPosition = () => {
  const positions = [];
  document
    .querySelectorAll(".empty")
    .forEach((empty) =>
      positions.push(
        moves[empty.dataset.cell]
          .filter((position) => cells[position].classList.contains("occupied"))
          .filter((position) =>
            cells[
              commonNeighbor(empty.dataset.cell, position)
            ].classList.contains("occupied")
          )
      )
    );
  // removes duplicated positions
  return [...new Set(positions.flat())];
};

const start = () => {
  initialize();
  cleanup();
  checkEnd();
};

// IIFE starter.
(() => {
  const board = new Board();
  const geese = new Array(13).fill(0).map(() => new Goose());
  const fox = new Fox(16); // parameter as start position

  board.setFigures(...geese, fox);

  initialize();

  const allNeighbors = Board.getAllNeighborPositions(fox);
  const emptyNeighbors = Board.getEmptyNeighborPositions(fox, ...geese);

  console.log(fox);
  console.log("all neighbors:", allNeighbors);
  console.log("empty neighbors:", emptyNeighbors);
  console.log(
    "1st goose empty neighbors:",
    Board.getEmptyNeighborPositions(geese[0], ...geese, fox)
  );

  const moveableGeese = Goose.getMoveableGeese(geese, fox);
  board.markMoveable(moveableGeese);

  // cells = document.querySelectorAll(".cell");
  // start();
})();
