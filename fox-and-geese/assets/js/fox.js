import { Board } from "./board.js";

export class Fox {
  transposablePositions = [];
  position;

  constructor() {}

  findTransposablePositions(geese) {
    this.transposablePositions = Board.getEmptyNeighborPositions(
      this,
      ...geese
    );
  }

  getNextPosition() {
    if (this.transposablePositions.length === 0) {
      return;
    }
    const random = Math.floor(
      Math.random() * this.transposablePositions.length
    );
    return this.transposablePositions[random];
  }
}
