"use strict";
import { solve } from "./js/solve.js";
import { extreme } from "./js/example-boards.js";

// reusable 2D board-creator fn
const createBoard = () => {
  const rows = 9;
  const cols = 9;
  const board = document.querySelector("#board");

  const template = [];
  for (let row = 0; row < rows; row++) {
    template.push(`<div class="row">`);
    for (let col = 0; col < cols; col++) {
      template.push(
        `<div class="cell" data-col="${col}" data-row="${row}"></div>`
      );
    }
    template.push(`</div>`);
  }

  board.insertAdjacentHTML("afterbegin", template.join(""));
};

const emptyCells = (cells) => {
  cells.forEach((cell) => {
    cell.textContent = null;
    cell.classList.remove("input");
  });
};

const startSolve = (cells) => {
  const inputBoard = [];

  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    if (col === 0) inputBoard.push(new Array(9));

    inputBoard[row][col] = Number(cell.textContent) || 0;
  });

  const { outputBoard, isBoardSolved, iteration } = solve(inputBoard);

  if (isBoardSolved) {
    outputBoard
      .flat()
      .forEach((cell, index) => (cells[index].textContent = cell));

    return `I have solved the board in ${iteration} iteration.`;
  }

  return `I can not solve the board. last iteration#: ${iteration}`;
};

// START
(() => {
  createBoard();

  let selectedCell = null;

  const cells = document.querySelectorAll(".cell");

  // fills the board for testing puprose only
  extreme.flat().forEach((cell, index) => {
    if (cell) {
      cells[index].textContent = cell;
      cells[index].classList.add("input");
    }
  });
  // -----------------------------------------

  cells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      event.stopPropagation();

      if (selectedCell) {
        selectedCell.classList.remove("selected");
      }

      selectedCell = event.target;
      selectedCell.classList.add("input", "selected");
      if (!selectedCell.textContent) selectedCell.textContent = 1;
    });

    cell.addEventListener("dblclick", (event) => {
      event.stopPropagation();

      const selected = event.target;
      selected.classList.remove("input", "selected");
      selected.textContent = null;
      selectedCell = null;
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target !== document.body) {
      if (selectedCell) {
        selectedCell.classList.remove("selected");
      }

      selectedCell = null;
    }
  });

  document.addEventListener(
    "wheel",
    (event) => {
      if (!selectedCell) return;

      event.preventDefault();
      // event.stopPropagation();

      const currentValue = Number(selectedCell.textContent) || 1;
      let nextValue = event.deltaY > 0 ? currentValue + 1 : currentValue - 1;

      if (nextValue < 1) nextValue = 9;
      if (nextValue > 9) nextValue = 1;

      selectedCell.textContent = nextValue;
    },
    { passive: false }
  );

  const resultInfo = document.querySelector("#result-info");
  const startButton = document.querySelector("#solve-btn");
  const emptyButton = document.querySelector("#empty-btn");

  startButton.addEventListener("click", () => {
    resultInfo.textContent = null;
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resultInfo.textContent = startSolve(cells);
    }, 0);
  });

  emptyButton.addEventListener("click", () => {
    emptyCells(cells);
    resultInfo.textContent = null;
  });
})();
