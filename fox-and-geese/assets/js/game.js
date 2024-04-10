"use strict";

import { Board } from "./board.js";
import { Goose } from "./goose.js";
import { Fox } from "./fox.js";
import {
  showGeeseNumber,
  showInfoBoxWithTimeout,
  buttonHandler,
} from "./helpers.js";

let board, geese, fox, takeableGeese, takenGoose, firstMove;

const theEnd = (text) => {
  showInfoBoxWithTimeout(text, Infinity);
  buttonHandler("Új játék");
};

const foxTurn = () => {
  fox.position = fox.getNextPosition();
  setBoardState();
  // captured geese?
  showGeeseNumber(geese.length);
  isEnd();
};

const removeTransposables = (positions) => {
  board.updateCellsAttributes(positions, "remove", ["transposable"], transpose);
};

const addTransposables = (positions) => {
  board.updateCellsAttributes(positions, "add", ["transposable"], transpose);
};

const addTakeables = () => {
  geese.forEach(
    (goose) =>
      (goose.transposablePositions = Goose.findTransposablePositions(
        goose,
        fox,
        geese
      ))
  );
  takeableGeese = geese.filter(
    (goose) => goose.transposablePositions.length > 0
  );
  const positions = takeableGeese.map((goose) => goose.position);
  board.updateCellsAttributes(positions, "add", ["takeable"], take);
};

const removeTakeables = () => {
  const positions = takeableGeese.map((goose) => goose.position);
  board.updateCellsAttributes(positions, "remove", ["takeable", "taken"], take);
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

  showInfoBoxWithTimeout("Jelölj ki egy libát!");
  // add takeable geese
  addTakeables();
  return false;
};

const take = (event) => {
  const positionTaken = Number(event.target.dataset.cell);
  const isNewTake = takenGoose ? positionTaken !== takenGoose.position : true;

  if (!isNewTake) return;

  if (takenGoose) {
    removeTransposables(takenGoose.transposablePositions);
  }

  const prevPosition = takenGoose ? takenGoose.position : null;
  board.takeFigure(positionTaken, prevPosition);

  takenGoose = takeableGeese.find((goose) => goose.position === positionTaken);
  addTransposables(takenGoose.transposablePositions);
};

const transpose = (event) => {
  if (firstMove) {
    firstMove = false;
    buttonHandler("Újrakezdés", startGame);
  }

  const nextPosition = Number(event.target.dataset.cell);
  takenGoose.position = nextPosition;

  removeTransposables(takenGoose.transposablePositions);
  removeTakeables();

  setBoardState();

  if (!isEnd("check_fox")) {
    foxTurn();
  }
};

const setBoardState = () => {
  // set all figures to new position
  board.setFigures(...geese, fox);

  showGeeseNumber(geese.length);
  takenGoose = null;
};

const initializeContext = () => {
  buttonHandler("A játék leírása", () => {
    window.location = "#playRules";
  });

  showInfoBoxWithTimeout("Jelölj ki egy libát!");
};

const startGame = () => {
  // reset fox to start position and recreate geese.
  geese = new Array(13).fill(0).map(() => new Goose());
  fox.position = 9;

  initializeContext();
  setBoardState();
  addTakeables();
  firstMove = true;
};

// IIFE starter after page refresh/reload.
(() => {
  board = new Board();
  fox = new Fox();
  startGame();
})();
