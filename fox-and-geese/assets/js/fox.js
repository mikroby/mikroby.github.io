import { Board } from "./board.js";

export class Fox {
  transposablePositions = [];
  position;

  constructor() {}

  getTransposablePositions(geese) {
    this.transposablePositions = Board.getEmptyNeighborPositions(
      this,
      ...geese
    );
  }

  /** randomized step */
  getRandomPosition() {
    const random = Math.floor(
      Math.random() * this.transposablePositions.length
    );

    this.position = this.transposablePositions[random];
  }

  /** step by maximum freedom */
  getNextPosition(geese) {
    const positions = this.transposablePositions.map((position) => ({
      position,
      freedom: Board.getEmptyNeighborPositions({ position }, ...geese).length,
    }));

    const sortedPositions = positions.sort((a, b) => b.freedom - a.freedom);

    console.log(sortedPositions);
    this.position = sortedPositions[0].position;
  }
}
