"use strict";

import { maxCell } from "./config.js";
import {
  fillMatrixWith,
  getRandomElementFrom,
  getMaxFitRectSizes,
  swapValue,
} from "./helpers.js";

let field;

const isShipPlaceableBy = {
  isOccupied: (row, col) => field[row][col] !== 0,

  row(x, y, ship) {
    for (let row = y - 1; row <= y + 1; row++) {
      if (row < 0 || row >= maxCell) {
        continue;
      }

      for (let col = x - 1; col <= x + ship; col++) {
        if (col < 0 || col >= maxCell) {
          continue;
        }

        if (this.isOccupied(row, col)) {
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

        if (this.isOccupied(row, col)) {
          return false;
        }
      }
    }
    return true;
  },
};

/** Occupy field with the ship, returns cells of related DOM elements */
const occupyFieldBy = (direction, ship, row, col) => {
  const cells = [];

  for (let i = 0; i < ship; i++) {
    if (direction === "row") {
      field[row][col + i] = ship;
      cells.push(
        document.querySelector(`[data-y='${row}'] [data-x='${col + i}'`)
      );
    } else {
      field[row + i][col] = ship;
      cells.push(
        document.querySelector(`[data-y='${row + i}'] [data-x='${col}'`)
      );
    }
  }
  return cells;
};

export const hideShips = (shipsToAccomodate) => {
  field = fillMatrixWith({ rows: maxCell, cols: maxCell, value: 0 });

  const accomodatedShips = [];
  let freePlacesForShip, direction, iteration;

  shipsToAccomodate.forEach((ship) => {
    direction = getRandomElementFrom(["row", "col"]);
    iteration = 1;

    do {
      freePlacesForShip = [];

      const { maxX, maxY } = getMaxFitRectSizes(direction, ship, maxCell);

      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          if (isShipPlaceableBy[direction](x, y, ship)) {
            freePlacesForShip.push([x, y]);
          }
        }
      }

      // in case there is no free place for the ship,
      // iterates with the swapped direction...but not likely to happen.
      if (freePlacesForShip.length === 0) {
        direction = swapValue(direction);
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

    const [col, row] = getRandomElementFrom(freePlacesForShip);
    const shipCells = occupyFieldBy(direction, ship, row, col);
    accomodatedShips.push(shipCells);
  });

  return accomodatedShips;
};
