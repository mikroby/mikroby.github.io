"use strict";

import { Board } from "./board.js";
import { Goose } from "./goose.js";
import { Fox } from "./fox.js";
import {
  showGeeseNumber,
  showInfoBoxWithTimeout,
  buttonHandler,
} from "./helpers.js";
import { texts, setUItexts } from "./texts.js";

const board = new Board();
const fox = new Fox();
let geese, takeablePositions, takenGoose, firstMove;

const endGame = (text) => {
  // clean up all takeable cells to stop further playing.
  board.removeTakeables(...takeablePositions);
  showInfoBoxWithTimeout(text, Infinity, "override");
};

const isWinner = (figureName) => {
  let checkResult = false;

  switch (figureName) {
    case "geese":
      // update and check Fox's state
      fox.getTransposablePositions(geese);

      if (fox.transposablePositions.length === 0) {
        endGame(texts.geeseWon);
        checkResult = true;
      }
      break;
    case "fox":
      // check minimum geese sufficient to win.
      if (geese.length < 4) {
        endGame(texts.foxWon);
        checkResult = true;
      }
  }

  return checkResult;
};

export const take = (event) => {
  const positionTaken = Number(event.target.dataset.cell);
  const isNewPositionTaken = takenGoose
    ? positionTaken !== takenGoose.position
    : true;

  if (!isNewPositionTaken) return;

  // clean up transposables for previously taken
  if (takenGoose) {
    board.removeTransposables(takenGoose.transposablePositions);
  }

  // change taken figures
  const prevPosition = takenGoose ? takenGoose.position : null;
  board.takeFigure(positionTaken, prevPosition);

  // set new taken and related transposables
  takenGoose = geese.find((goose) => goose.position === positionTaken);
  // needed for correct rendering
  const id = setTimeout(() => {
    clearTimeout(id);
    board.addTransposables(takenGoose.transposablePositions);
  }, 0);
};

export const transpose = (event) => {
  if (firstMove) {
    firstMove = false;
    buttonHandler(texts.newGame, () => {
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

  updateBoardState();

  if (!isWinner("geese")) {
    foxTurn();
  }
};

const updateBoardState = () => {
  board.setFigures(...geese, fox);
  showGeeseNumber(geese.length);
};

const geeseTurn = () => {
  takenGoose = null;
  showInfoBoxWithTimeout(texts.geeseTurn);

  // manage changes in takeable geese only
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

const captureGoose = (gooseToCapture) => {
  showInfoBoxWithTimeout(texts.captureGoose, undefined, "no_override");
  const indexOfCaptured = geese.findIndex(
    (goose) => goose.position === gooseToCapture
  );
  geese.splice(indexOfCaptured, 1);
};

const foxTurn = () => {
  const { position, gooseToCapture } = fox.getNextPosition(geese);

  fox.position = position;

  if (gooseToCapture) {
    captureGoose(gooseToCapture);
  }

  updateBoardState();

  if (!isWinner("fox")) {
    geeseTurn();
  }
};

const startGame = () => {
  // reset fox to start position and redefine geese to default.
  geese = new Array(13).fill(0).map(() => new Goose());
  fox.position = 9;
  firstMove = true;

  buttonHandler(texts.gameInfo, () => {
    window.location = "#playRules";
  });
  updateBoardState();
  geeseTurn();
};

// IIFE starter after page refresh/reload - does it add to security?
(() => {
  setUItexts();
  startGame();
})();
