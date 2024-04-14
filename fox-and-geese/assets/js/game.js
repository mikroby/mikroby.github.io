"use strict";

import { Board } from "./board.js";
import { Goose } from "./goose.js";
import { Fox } from "./fox.js";
import {
  showGeeseNumber,
  showInfoBoxWithTimeout,
  buttonHandler,
} from "./helpers.js";

// IIFE starter after page refresh/reload.
// (() => {
const board = new Board();
const fox = new Fox();
let geese, takeablePositions, takenGoose, firstMove;

const theEnd = (text) => {
  showInfoBoxWithTimeout(text, Infinity);
  buttonHandler("Új játék");
  // TODO: probably remove all takeable cells.
};

const isWinner = (figureName) => {
  let checkResult = false;

  switch (figureName) {
    case "geese":
      // update Fox's state
      const transposablePositions = fox.getTransposablePositions(geese);
      fox.transposablePositions = transposablePositions;
      console.log(fox);
      if (fox.transposablePositions.length === 0) {
        theEnd("A libák nyertek!");
        checkResult = true;
      }
      break;
    case "fox":
      if (geese.length < 4) {
        theEnd("A róka nyerte a játszmát!");
        checkResult = true;
      }
  }

  return checkResult;
};

export const take = (event) => {
  const positionTaken = Number(event.target.dataset.cell);
  const isNewTake = takenGoose ? positionTaken !== takenGoose.position : true;

  if (!isNewTake) return;

  if (takenGoose) {
    board.removeTransposables(takenGoose.transposablePositions);
  }

  const prevPosition = takenGoose ? takenGoose.position : null;
  board.takeFigure(positionTaken, prevPosition);

  takenGoose = geese.find((goose) => goose.position === positionTaken);
  board.addTransposables(takenGoose.transposablePositions);
};

export const transpose = (event) => {
  if (firstMove) {
    firstMove = false;
    buttonHandler("Újrakezdés", startGame);
  }

  board.removeTransposables(takenGoose.transposablePositions);
  // TODO: optimize removes only for transposed cell.
  board.removeTakeables(takeablePositions);

  const nextPosition = Number(event.target.dataset.cell);
  takenGoose.position = nextPosition;

  setBoardState();

  if (!isWinner("geese")) {
    foxTurn();
  }
};

const setBoardState = () => {
  // set all figures to new position
  board.setFigures(...geese, fox);
  showGeeseNumber(geese.length);
};

const geeseTurn = () => {
  takenGoose = null;
  showInfoBoxWithTimeout("Jelölj ki egy libát!");
  // add takeable geese
  takeablePositions = Goose.getTakeableGeesePositions(geese, fox);
  // TODO: optimize adding only new takeable cells.
  board.addTakeables(takeablePositions);
};

const foxTurn = () => {
  fox.position = fox.getNextPosition();
  setBoardState();
  // captured geese?
  if (!isWinner("fox")) {
    geeseTurn();
  }
};

const startGame = () => {
  // reset fox to start position and recreate geese.
  geese = new Array(13).fill(0).map(() => new Goose());
  fox.position = 9;
  firstMove = true;

  buttonHandler("A játék leírása", () => {
    window.location = "#playRules";
  });
  setBoardState();
  geeseTurn();
};

startGame();
// })();
