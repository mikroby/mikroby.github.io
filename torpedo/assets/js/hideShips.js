'use strict';

import { shipsToLocate, maxCell } from "./main.js";

const hideShips = () => {

  const checkChanceIn = {
    'rows'(x, y, ship) {
      for (let row = y - 1; row <= y + 1; row++) {
        if (row < 0 || row >= maxCell) { continue }

        for (let col = x - 1; col <= x + ship; col++) {
          if (col < 0 || col >= maxCell) { continue }

          if (field[row][col] !== 0) { return false }
        }
      }
      return true;
    },
    'cols'(x, y, ship) {
      for (let col = x - 1; col <= x + 1; col++) {
        if (col < 0 || col >= maxCell) { continue }

        for (let row = y - 1; row <= y + ship; row++) {
          if (row < 0 || row >= maxCell) { continue }

          if (field[row][col] !== 0) { return false }
        }
      }
      return true;
    }
  }

  const locateShipIn = {
    'rows'(ship, row, col) {
      const array = [];
      for (let i = 0; i < ship; i++) {
        field[row][col + i] = ship;
        array.push(document.querySelector(`[data-y='${row}'] [data-x='${col + i}'`));
      }
      return array;
    },
    'cols'(ship, row, col) {
      const array = [];
      for (let i = 0; i < ship; i++) {
        field[row + i][col] = ship;
        array.push(document.querySelector(`[data-y='${row + i}'] [data-x='${col}'`));
      }
      return array;
    }
  }

  const field = Array(maxCell).fill().map(() => Array(maxCell).fill(0));
  const ships = [];
  let chances, direction, counter;

  shipsToLocate.forEach((ship) => {
    direction = Math.trunc(Math.random() * 2) === 0 ? 'rows' : 'cols';
    counter = 1;

    do {
      chances = [];
      // console.log(ship, direction);

      const maxY = direction === 'rows' ? maxCell : maxCell - ship;
      const maxX = direction === 'cols' ? maxCell : maxCell - ship;

      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          if (checkChanceIn[direction](x, y, ship)) {
            chances.push([x, y]);
          }
        }
      }

      // in case of 0 chance function tries other direction...but not likely to happen.
      if (chances.length === 0) {
        alert(`megpróbálom másik irányban elhelyezni a ${ship} méretű hajót!`);
        direction = direction === 'rows' ? 'cols' : 'rows';
        counter++;
      }
      if (counter === 3) {
        throw `nem helyezhető el a ${ship} méretű hajó`;
      }

    } while (chances.length === 0);
    const selection = Math.trunc(Math.random() * chances.length);
    const row = chances[selection][1];
    const col = chances[selection][0];
    ships.push(locateShipIn[direction](ship, row, col));
  });

  return ships;
}

export { hideShips };