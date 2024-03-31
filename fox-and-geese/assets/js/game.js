"use strict";

import { Board } from "./board.js";
import { Goose } from "./goose.js";
import { Fox } from "./fox.js";

const header = document.querySelector("#game__header");
const infoBox = document.querySelector(".infoBox");
const geeseNumber = document.querySelector("#geeseNumber");
const button = document.querySelector("#toText");
let firstMove, timerId;

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

const showGeeseNumber = () => {
  geeseNumber.textContent = geese.length;
};

const checkEnd = () => {
  // Fox's state
  fox.findTransposablePositions(geese);
  console.log(fox);

  // ez majd a róka lépése után kell
  showGeeseNumber();

  infoBox.classList.add("blinkInfo");

  if (fox.transposablePositions.length === 0) {
    theEnd("Megnyerted a játékot!");
    return;
  }

  if (geese.length === 0) {
    theEnd("A róka nyerte a játszmát!");
    return;
  }

  blinkInfo();
};

const theEnd = (text) => {
  clearTimeout(timerId);
  board.cleanup([take, transpose]);
  infoBox.textContent = text;
  button.textContent = "Új játék";
  button.onclick = start;
};

const start = () => {
  initializeUI();
  checkEnd();
};

const initializeUI = () => {
  button.textContent = "A játék leírása";
  button.onclick = () => {
    window.location = "#playRules";
  };
  infoBox.textContent = "Jelölj ki egy libát!";
  firstMove = true;
  showGeeseNumber();
};

let board, geese, fox, takenGoose;

const take = (event) => {
  const positionTaken = Number(event.target.dataset.cell);
  const isNewTake = takenGoose ? positionTaken !== takenGoose.position : true;
  if (isNewTake) {
    const prevPosition = takenGoose ? takenGoose.position : null;
    board.takeFigure(positionTaken, transpose, prevPosition);
    takenGoose = geese.find((goose) => goose.position === positionTaken);

    board.markTransposables(takenGoose.transposablePositions, transpose);
  }
};

const transpose = (event) => {
  if (firstMove) {
    firstMove = false;
    button.textContent = "Újrakezdés";
    button.onclick = start;
  }

  const nextPosition = Number(event.target.dataset.cell);
  takenGoose.position = nextPosition;

  board.removeAllTransposables(transpose);
  setNewBoardState();

  animateHeader();
  checkEnd();
};

const setNewBoardState = () => {
  // cleanup eventListeners and classes
  board.cleanup([take, transpose]);
  // set all figures to new position
  board.setFigures(...geese, fox);
  // ez lehetne a getMoveableGeese-en belül is:
  geese.forEach((goose) => goose.findTransposablePositions(fox, geese));
  const moveableGeese = Goose.getMoveableGeese(geese);
  board.markMoveable(moveableGeese, take);

  takenGoose = null;
};

// IIFE starter.
(() => {
  board = new Board();
  geese = new Array(13).fill(0).map(() => new Goose());
  fox = new Fox(9); // parameter as start position

  initializeUI();

  setNewBoardState();

  // start();
})();
