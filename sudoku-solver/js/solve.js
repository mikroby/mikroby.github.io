"use strict";

import { deepCopy, prepare, purge, getProbabilityList } from "./helpers.js";
import { iterate } from "./iterate.js";

export const solve = (inputBoard) => {
  let board = prepare(inputBoard);
  let snapshot,
    probabilityList,
    iteration = 0,
    isBoardSolved = false;

  do {
    const result = iterate(board, iteration);
    iteration = result.iteration;
    isBoardSolved = result.isBoardSolved;

    if (!isBoardSolved) {
      // after all simple values fixed, a list of probable values and a snapshot needed
      if (!probabilityList) {
        probabilityList = getProbabilityList(board);
        snapshot = deepCopy(board);
      }

      if (probabilityList.length === 0) {
        break;
      }

      // restart from snapshot trying a new probable value to fix in next iteration
      const { row, col, value } = probabilityList.pop();
      board = deepCopy(snapshot);
      board[row][col].value = value;
    }
  } while (!isBoardSolved);

  // iteration have finished, return final result
  return { outputBoard: purge(board), isBoardSolved, iteration };
};
