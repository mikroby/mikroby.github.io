"use strict";

import { shipsToAccomodate, maxCell } from "./config.js";

let field;

const isShipPlaceableBy = {
  row(x, y, ship) {
    for (let row = y - 1; row <= y + 1; row++) {
      if (row < 0 || row >= maxCell) {
        continue;
      }

      for (let col = x - 1; col <= x + ship; col++) {
        if (col < 0 || col >= maxCell) {
          continue;
        }

        if (field[row][col] !== 0) {
          return false;
        }
      }
    }
    return true;
  },

  col(x, y, ship) {
    for (let col = x - 1; col <= x + 1; col++) {
      if (col < 0 || col >= maxCell) {
        continue;
      }

      for (let row = y - 1; row <= y + ship; row++) {
        if (row < 0 || row >= maxCell) {
          continue;
        }

        if (field[row][col] !== 0) {
          return false;
        }
      }
    }
    return true;
  },
};

const placeShipIntoFieldBy = (direction, ship, row, col) => {
  const cells = [];

  if (direction === "row") {
    for (let i = 0; i < ship; i++) {
      field[row][col + i] = ship;
      cells.push(
        document.querySelector(`[data-y='${row}'] [data-x='${col + i}'`)
      );
    }
  } else {
    for (let i = 0; i < ship; i++) {
      field[row + i][col] = ship;
      cells.push(
        document.querySelector(`[data-y='${row + i}'] [data-x='${col}'`)
      );
    }
  }
  return cells;
};

const getRandomIntegerLessThan = (value) => Math.trunc(Math.random() * value);

const changeDirection = (direction) => (direction === "row" ? "col" : "row");

const getMaxFitCoords = (direction, shipSize) => ({
  maxY: direction === "row" ? maxCell : maxCell - shipSize,
  maxX: direction === "col" ? maxCell : maxCell - shipSize,
});

const fillSizedMatrixWith = (size, value) =>
  Array(size)
    .fill()
    .map(() => Array(size).fill(value));

export const hideShips = () => {
  field = fillSizedMatrixWith(maxCell, 0);

  const accomodatedShips = [];
  let freePlacesForShip, direction, iteration;

  shipsToAccomodate.forEach((ship) => {
    direction = getRandomIntegerLessThan(2) === 0 ? "row" : "col";
    iteration = 1;

    do {
      freePlacesForShip = [];

      const { maxX, maxY } = getMaxFitCoords(direction, ship);

      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          if (isShipPlaceableBy[direction](x, y, ship)) {
            freePlacesForShip.push([x, y]);
          }
        }
      }

      // in case there is no free place for the ship,
      // iterates the other direction...but not likely to happen.
      if (freePlacesForShip.length === 0) {
        direction = changeDirection(direction);
        alert(
          `Trying to place the ${ship} element(s) ship in ${direction} direction.`
        );
        iteration++;
      }

      // there is problem with the config constants.
      if (iteration > 2) {
        throw `The ${ship} element(s) ship can not be placed. Check config constants.`;
      }
    } while (freePlacesForShip.length === 0);

    const randomIndex = getRandomIntegerLessThan(freePlacesForShip.length);
    const [col, row] = freePlacesForShip[randomIndex];
    const shipCells = placeShipIntoFieldBy(direction, ship, row, col);
    accomodatedShips.push(shipCells);
  });

  return accomodatedShips;
};
