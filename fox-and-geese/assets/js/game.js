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
  // clean up all takeable cells to stop further playing.
  board.removeTakeables(...takeablePositions);
  showInfoBoxWithTimeout(text, Infinity);
};

const isWinner = (figureName) => {
  let checkResult = false;

  switch (figureName) {
    case "geese":
      // update and check Fox's state
      fox.getTransposablePositions(geese);
      console.log(fox);
      if (fox.transposablePositions.length === 0) {
        theEnd("A libák nyertek!");
        checkResult = true;
      }
      break;
    case "fox":
      // check minimum geese sufficient to win.
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
    buttonHandler("Új játék", () => {
      if (takenGoose) {
        board.removeTransposables(takenGoose.transposablePositions);
      }
      board.removeTakeables(...takeablePositions);
      startGame();
    });
  }

  // clean up the currently transposed cell.
  board.removeTransposables(takenGoose.transposablePositions);
  board.removeTakeables(takenGoose.position);

  const nextPosition = Number(event.target.dataset.cell);
  takenGoose.position = nextPosition;

  setBoardState();

  if (!isWinner("geese")) {
    foxTurn();
  }
};

const setBoardState = () => {
  board.setFigures(...geese, fox);
  showGeeseNumber(geese.length);
};

const geeseTurn = () => {
  takenGoose = null;
  showInfoBoxWithTimeout("Jelölj ki egy libát!");

  // manage only changes in takeable geese
  const prevPositions = takeablePositions;
  takeablePositions = Goose.getTakeableGeesePositions(geese, fox);

  if (firstMove) {
    board.addTakeables(takeablePositions);
    return;
  }

  const positionsToRemove = prevPositions.filter(
    (position) => !takeablePositions.includes(position)
  );
  board.removeTakeables(...positionsToRemove);

  const positionsToAdd = takeablePositions.filter(
    (position) => !prevPositions.includes(position)
  );
  board.addTakeables(positionsToAdd);
};

const foxTurn = () => {
  fox.getNextPosition(geese);
  // TODO: chcek captured geese?
  setBoardState();

  if (!isWinner("fox")) {
    geeseTurn();
  }
};

const startGame = () => {
  // reset fox to start position and redefine geese.
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
