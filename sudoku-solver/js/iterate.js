"use strict";

import {
  reduceByHouse,
  reduceByRow,
  reduceByCol,
  reduceByOnlyinHouse,
  reduceByOnlyInRow,
  reduceByOnlyInCol,
  getIsSolved,
} from "./helpers.js";

export const iterate = (board, iteration) => {
  let iddle = 0,
    isBoardSolved = false,
    isNewCellFixed = false;

  const fixValueOf = (cell) => {
    cell.value = cell.value[0];
    isNewCellFixed = true;
  };

  do {
    isNewCellFixed = false;
    iteration++;

    // walks through all the cells
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];

        if (typeof cell.value === "number") {
          // cell is already fixed, go to next one
          continue;
        }

        // check house
        cell.value = reduceByHouse(cell.value, board, cell.house);
        if (cell.value.length === 1) {
          fixValueOf(cell);
          continue;
        }

        // check row
        cell.value = reduceByRow(cell.value, board, row);
        if (cell.value.length === 1) {
          fixValueOf(cell);
          continue;
        }

        // check column
        cell.value = reduceByCol(cell.value, board, col);
        if (cell.value.length === 1) {
          fixValueOf(cell);
          continue;
        }

        // check for only possible value in house of the cell
        cell.value = reduceByOnlyinHouse(cell.value, board, cell.house);
        if (cell.value.length === 1) {
          fixValueOf(cell);
          continue;
        }

        // check for only possible value in row of the cell
        cell.value = reduceByOnlyInRow(cell.value, board, row);
        if (cell.value.length === 1) {
          fixValueOf(cell);
          continue;
        }

        // check for only possible value in col of the cell
        cell.value = reduceByOnlyInCol(cell.value, board, col);
        if (cell.value.length === 1) {
          fixValueOf(cell);
          // continue;
        }
      }
    }

    isBoardSolved = getIsSolved(board);
    iddle = isNewCellFixed ? 0 : iddle + 1;
  } while (iddle < 2 && !isBoardSolved);

  return { isBoardSolved, iteration };
};
