import { Goose } from "./goose.js";
import { take, transpose } from "./game.js";

const takeCallback = (event) => take(event);
const transposeCallback = (event) => transpose(event);

// ┌───── B O A R D ────┐
// │       0  1  2      │
// │       3  4  5      │
// │ 6  7  8  9 10 11 12│
// │13 14 15 16 17 18 19│
// │20 21 22 23 24 25 26│
// │      27 28 29      │
// │      30 31 32      │
// └────────────────────┘

export class Board {
  static #orthogonals = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29],
    [30, 31, 32],

    [6, 13, 20],
    [7, 14, 21],
    [0, 3, 8, 15, 22, 27, 30],
    [1, 4, 9, 16, 23, 28, 31],
    [2, 5, 10, 17, 24, 29, 32],
    [11, 18, 25],
    [12, 19, 26],
  ];
  static #diagonals = [
    [0, 4, 10, 18, 26],
    [8, 16, 24],
    [6, 14, 22, 28, 32],

    [2, 4, 8, 14, 20],
    [10, 16, 22],
    [12, 18, 24, 28, 30],
  ];
  static #lines = [...Board.#orthogonals, ...Board.#diagonals];
  static #rowPattern = [3, 3, 7, 7, 7, 3, 3];
  static #boardElement = document.querySelector("#board");

  #createBoard() {
    const template = [];
    let from = 0;

    for (const cols of Board.#rowPattern) {
      template.push(`<div class="row">`);

      for (let cell = from; cell < from + cols; cell++) {
        template.push(`<div class="cell" data-cell="${cell}"></div>`);
      }

      template.push(`</div>`);
      from += cols;
    }

    Board.#boardElement.innerHTML = template.join("");
  }

  constructor() {
    this.#createBoard();
    this.cells = Board.#boardElement.querySelectorAll(".cell");
  }

  static #getAllNeighborPositions(figure) {
    let neighborPositions = [];
    Board.#lines.forEach((line) => {
      const foundIndex = line.indexOf(figure.position);
      if (foundIndex > -1) {
        if (foundIndex > 0) neighborPositions.push(line[foundIndex - 1]);
        if (foundIndex < line.length - 1)
          neighborPositions.push(line[foundIndex + 1]);
      }
    });

    return neighborPositions;
  }

  static getEmptyNeighborPositions(figure, ...otherFigures) {
    const otherPositions = otherFigures.map((creature) => creature.position);
    return Board.#getAllNeighborPositions(figure).filter(
      (position) => !otherPositions.includes(position)
    );
  }

  static getInLineEmptyNeighborPositions(figure, ...otherFigures) {
    const emptyNeighbors = Board.getEmptyNeighborPositions(figure, ...otherFigures)

    if (emptyNeighbors.length < 2) { return undefined}

    const crossingLines = Board.#lines.filter(line => line.includes(figure.position))

    const inLineEmptyPairs = []

    crossingLines.forEach(line => {
      const matchedNeighbors = emptyNeighbors.filter(position => line.includes(position))
      
      if (matchedNeighbors.length === 2) {
        inLineEmptyPairs.push(matchedNeighbors)
      }
    })

    return inLineEmptyPairs.length > 0 ? inLineEmptyPairs : undefined
  }

  /** set figures to their current position */
  setFigures(...figures) {
    this.cells.forEach((cell) => {
      const currentCellPosition = Number(cell.dataset.cell);
      const figureFound = figures.find(
        (figure) => figure.position === currentCellPosition
      );

      cell.classList.remove("empty", "goose", "fox");

      if (!figureFound) {
        cell.classList.add("empty");
        return;
      }

      if (figureFound instanceof Goose) {
        cell.classList.add("goose");
      } else {
        cell.classList.add("fox");
      }
    });
  }

  /** handle class between 'taken' & 'takeable' states */
  takeFigure(newPosition, prevPosition) {
    if (prevPosition !== null) {
      this.cells[prevPosition].classList.replace("taken", "takeable");
    }

    this.cells[newPosition].classList.replace("takeable", "taken");
  }

  /** add or remove classes and click EventListener by given method*/
  #updateCells(positions, method, classes, callback) {
    positions.forEach((position) => {
      const cell = this.cells[position];
      cell.classList[method](...classes);
      cell[`${method}EventListener`]("click", callback);
    });
  }

  addTransposables(positions) {
    this.#updateCells(positions, "add", ["transposable"], transposeCallback);
  }

  removeTransposables(positions) {
    this.#updateCells(positions, "remove", ["transposable"], transposeCallback);
  }

  addTakeables(positions) {
    this.#updateCells(positions, "add", ["takeable"], takeCallback);
  }

  removeTakeables(...positions) {
    this.#updateCells(positions, "remove", ["takeable", "taken"], takeCallback);
  }
}
