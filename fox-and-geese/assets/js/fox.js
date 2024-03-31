import { Board } from "./board.js";

export class Fox {
  transposablePositions = [];

  constructor(position = 4) {
    this.position = position;
  }

  findTransposablePositions(geese) {
    this.transposablePositions = Board.getEmptyNeighborPositions(
      this,
      ...geese
    );
  }
}
