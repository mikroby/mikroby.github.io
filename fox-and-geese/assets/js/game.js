"use strict";

import { Board } from "./board.js";
import { Goose } from "./goose.js";
import { Fox } from "./fox.js";

const infoBox = document.querySelector(".infoBox");
const geeseNumber = document.querySelector("#geeseNumber");
const button = document.querySelector(".btn");

let board, geese, fox, takenGoose, firstMove, timerId

const blinkInfoBox = () => {
  infoBox.classList.add("showUp");
  timerId = setTimeout(() => {
    clearTimeout(timerId);
    infoBox.classList.remove("showUp");
  }, 1500);
};

const showGeeseNumber = () => {
  geeseNumber.textContent = geese.length;
};

const isEnd = () => {
  // Fox's state
  fox.findTransposablePositions(geese);
  console.log(fox);

  if (fox.transposablePositions.length === 0) {
    theEnd("A libák nyertek!");
    return true;
  }

  if (geese.length === 0) {
    theEnd("A róka nyerte a játszmát!");
    return true;
  }

  blinkInfoBox();
  return false
};

const theEnd = (text) => {
  board.cleanup([take, transpose]);

  clearTimeout(timerId);
  infoBox.textContent = text;
  infoBox.classList.add("showUp");

  button.textContent = "Új játék";
  button.onclick = start;
};

const foxTurn = () => {
  fox.position = fox.getNextPosition()
  setBoardState()
  // captured geese?
  showGeeseNumber();
  isEnd()
}

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

  // refine?
  board.removeAllTransposables(transpose);
  setBoardState();

  if (!isEnd()) {
    foxTurn()
  }
};

const setBoardState = () => {
  // cleanup eventListeners and classes
  if (!firstMove) board.cleanup([take, transpose]);
  // set all figures to new position
  board.setFigures(...geese, fox);
  // find takeable geese
  geese.forEach((goose) => Goose.findTransposablePositions(goose, fox, geese));
  const takeableGeese = Goose.getTakeableGeese(geese);
  board.markTakeables(takeableGeese, take);

  takenGoose = null;
};

const initializeUI = () => {
  button.textContent = "A játék leírása";
  button.onclick = () => {
    window.location = "#playRules";
  };

  infoBox.textContent = "Jelölj ki egy libát!";
  blinkInfoBox();

  showGeeseNumber();
};

const start = () => {
  // reset fox and geese to start position
  // geese.forEach((goose, index) => Goose.setToStartPosition(goose, index))
  geese = new Array(13).fill(0).map(() => new Goose());
  fox.position = 9

  initializeUI();
  setBoardState();
  firstMove = true;
};

// IIFE starter.
(() => {
  board = new Board();
  fox = new Fox();
  start();
})();
