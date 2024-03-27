import * as Fox from "./fox.js";
import * as Geese from "./geese.js";

// Define the board as a 2D array
let board = [
  ["⌂", "⌂", "⌂", "⌂", "⌂"],
  ["⌂", "⌂", "⌂", "⌂", "⌂"],
  ["⌂", "⌂", "⌂", "⌂", "⌂"],
  ["◦", "◦", "◦", "◦", "◦"],
  ["▲", "◦", "◦", "◦", "◦"],
];

const displayBoard = (board) => {
  for (const row of board) {
    console.log(row.join(" "));
  }
};

console.log("--------- START ---------");
displayBoard(board);

for (let step = 0; step < 5; step++) {
  console.log("-------------------------");

  // 1st step
  board = Fox.step(board);

  // 2nd step
  board = Geese.step(board);

  displayBoard(board);
}
