import { Board } from "./board.js";

export class Goose {
  static #startPattern = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  static #index = 0;

  transposablePositions = [];

  constructor() {
    // when reassigned at a new game, #index is set to default zero.
    if (Goose.#index === Goose.#startPattern.length) {
      Goose.#index = 0;
    }
    this.position = Goose.#startPattern[Goose.#index];
    Goose.#index++;
  }

  static getTakeableGeesePositions(geese, fox) {
    const takeablePositions = [];
    // update all the geese's transposablePositions array
    geese.forEach((goose) => {
      goose.transposablePositions = Goose.getTransposablePositions(
        goose,
        fox,
        geese
      );

      if (goose.transposablePositions.length > 0) {
        takeablePositions.push(goose.position);
      }
    });

    return takeablePositions;
  }

  static getTransposablePositions(goose, fox, geese) {
    return Board.getEmptyNeighborPositions(goose, ...geese, fox);
  }
}
