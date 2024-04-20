import { Board } from "./board.js";

/** return a random index of the collection */
const getRandom = (positions) => Math.floor(Math.random() * positions.length);

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

  /** get positions by maximum freedom */
  getMaxFreedom(geese) {
    const positions = this.transposablePositions.map((position) => ({
      position,
      freedom: Board.getEmptyNeighborPositions({ position }, ...geese).length,
    }));
    const sortedDescending = positions.sort((a, b) => b.freedom - a.freedom);
    const highestFreedom = sortedDescending[0].freedom;
    const highestCollection = sortedDescending.filter(
      (item) => item.freedom === highestFreedom
    );

    return highestCollection.map((item) => item.position);
  }

  setNextPosition(geese) {
    const positions = this.getMaxFreedom(geese);

    this.position =
      positions.length > 1 ? positions[getRandom(positions)] : positions[0];
  }
}
