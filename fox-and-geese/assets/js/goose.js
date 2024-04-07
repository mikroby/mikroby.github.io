import { Board } from "./board.js";

export class Goose {
  static #startPattern = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  static #index = 0;

  transposablePositions = [];
  position;

  constructor() {
    if (Goose.#index === Goose.#startPattern.length) {
      Goose.#index = 0
    }
    this.position = Goose.#startPattern[Goose.#index];
    Goose.#index++;
  }

  // static setToStartPosition(goose, index){
  //   goose.position = Goose.#startPattern[index]
  // } 

  static getTakeableGeese(geese) {
    return geese.filter((goose) => goose.transposablePositions.length > 0);
  }

  static findTransposablePositions(goose, fox, geese) {
    goose.transposablePositions = Board.getEmptyNeighborPositions(
      goose,
      ...geese,
      fox
    );
  }
}
