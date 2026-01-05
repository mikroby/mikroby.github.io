"use strict";

import { extreme as inputBoard } from "./js/example-boards.js";
import { displayInTerminal } from "./js/helpers.js";
import { solve } from "./js/solve.js";

// send board to solver
const { outputBoard, isBoardSolved, iteration } = solve(inputBoard);

// display final result
console.log("Sudoku Solver Node.js version");
console.log();
console.log("ORIGINAL BOARD:");
displayInTerminal(inputBoard);

console.log();
if (isBoardSolved) {
  console.log(`I have solved the board in ${iteration} iteration.`);
} else {
  console.log(`I can not solve the board. last iteration#: ${iteration}`);
}

console.log();
console.log("RESULTED BOARD:");
displayInTerminal(outputBoard);
