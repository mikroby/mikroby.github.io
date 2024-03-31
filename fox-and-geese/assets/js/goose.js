import { Board } from "./board.js";

export class Goose {
  static #startPattern = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  static #index = 0;

  transposablePositions = [];

  constructor() {
    this.position = Goose.#startPattern[Goose.#index];
    Goose.#index++;
  }

  static getMoveableGeese(geese) {
    return geese.filter((goose) => goose.transposablePositions.length > 0);
  }

  findTransposablePositions(fox, otherGeese) {
    this.transposablePositions = Board.getEmptyNeighborPositions(
      this,
      ...otherGeese,
      fox
    );
  }
}
