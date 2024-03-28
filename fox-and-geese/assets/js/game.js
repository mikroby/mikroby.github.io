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


const start = () => {
  initializeUI();
  cleanup();
  checkEnd();
};

const initializeUI = () => {
  button.textContent = "A játék leírása";
  button.onclick = () => {
    window.location = "#playRules";
  };
  infoBox.textContent = "Jelölj ki egy libát!";
  firstMove = true;
};

let board, geese, fox, takenGoose

const take = (event) => {
  const element = event.target
  const isNewTake = board.takeFigure(element, transpose)
  if (isNewTake) {
    const takenPosition = Number(element.dataset.cell)
    takenGoose = geese.find(goose => goose.position === takenPosition)
    const transposables = Goose.getTransposablePositions(takenGoose, geese, fox)
    board.markTransposables(transposables, transpose)
  }
}

const transpose = (event) => {
  if (firstMove) {
    firstMove = false;
    button.textContent = "Újrakezdés";
    button.onclick = start;
  }

  const nextPosition = Number(event.target.dataset.cell);
  takenGoose.position = nextPosition

  Board.removeAllTransposables(transpose)
  board.setFigures(...geese, fox);

  // const taken = document.querySelector(".taken");
  // const current = taken.dataset.cell;


  // this.classList.replace("empty", "occupied");
  // taken.classList.replace("occupied", "empty");

  animateHeader();
  // cleanup();
  // checkEnd();
}

// IIFE starter.
(() => {
  board = new Board();
  geese = new Array(13).fill(0).map(() => new Goose());
  fox = new Fox(16); // parameter as start position

  // set all figures to starting position
  board.setFigures(...geese, fox);

  initializeUI();

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
  board.markMoveable(moveableGeese, take);

  // cells = document.querySelectorAll(".cell");
  // start();
})();
