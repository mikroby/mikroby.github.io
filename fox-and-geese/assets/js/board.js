import { Goose } from "./goose.js";

export class Board {
  static ortho = [
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

  static diag = [
    [0, 4, 10, 18, 26],
    [8, 16, 24],
    [6, 14, 22, 28, 32],

    [2, 4, 8, 14, 20],
    [10, 16, 22],
    [12, 18, 24, 28, 30],
  ];

  static rowPattern = [3, 3, 7, 7, 7, 3, 3];

  static #boardElement = document.querySelector(".board");

  #createBoard() {
    const template = [];
    let from = 0;

    for (const cols of Board.rowPattern) {
      template.push(`<div class="row">`);

      for (let cell = from; cell < from + cols; cell++) {
        template.push(`<div class="cell empty" data-cell="${cell}"></div>`);
      }

      template.push(`</div>`);
      from += cols;
    }

    Board.#boardElement.innerHTML = template.join("");
  }

  constructor() {
    this.#createBoard();
    this.cells = document.querySelectorAll(".cell");
  }

  setFigures(...figures) {
    this.cells.forEach((cell) => {
      const figureFound = figures.find(
        (figure) => figure.position === Number(cell.dataset.cell)
      );

      if (!figureFound) {
        cell.classList.add("empty");
        return;
      }

      if (figureFound instanceof Goose) {
        cell.classList.replace("empty", "goose");
      } else {
        cell.classList.replace("empty", "fox");
      }
    });
  }

  static getAllNeighborPositions(figure) {
    let neighborPositions = [];
    [...Board.ortho, ...Board.diag].forEach((line) => {
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
    return Board.getAllNeighborPositions(figure).filter(
      (position) => !otherPositions.includes(position)
    );
  }

  markMoveable(figures, takeCallback) {
    figures.forEach((figure) => {
      const cell = this.cells[figure.position];
      cell.classList.add("moveable");
      cell.addEventListener("click", takeCallback);
    });
  }

  takeFigure(element, transposeCallback) {
    // select previously 'taken' or null
    const prevTaken = Board.#boardElement.querySelector(".taken");

    // noop if selected again
    if (element.isSameNode(prevTaken)) {
      return false;
    }

    // mark back previously 'taken' to 'moveable' if any
    if (prevTaken) {
      prevTaken.classList.replace("taken", "moveable");

      Board.removeAllTransposables(transposeCallback)
    }

    // mark new element as 'taken'
    element.classList.replace("moveable", "taken");

    return true
  }

  markTransposables(positions, transposeCallback) {
    positions.forEach(position => {
      this.cells[position].classList.add('transposable')
      this.cells[position].addEventListener('click', transposeCallback)
    })
  }

  static removeAllTransposables(transposeCallback) {
    Board.#boardElement.querySelectorAll(".transposable").forEach((cell) => {
      cell.classList.remove("transposable");
      cell.removeEventListener("click", transposeCallback);
    });
  }
}
