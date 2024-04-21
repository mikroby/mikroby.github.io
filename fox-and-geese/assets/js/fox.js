import { Board } from "./board.js";

/** return a random index of the collection */
const getRandomIndex = (positions) =>
  Math.floor(Math.random() * positions.length);

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

  getPositionsByMaxFreedom(geese) {
    const positions = this.transposablePositions.map((position) => ({
      position,
      freedom: Board.getEmptyNeighborPositions({ position }, ...geese).length,
    }));
    // sorted descending by 'freedom'
    positions.sort((a, b) => b.freedom - a.freedom);
    const highestValue = positions[0].freedom;
    const collectionOfEqualValue = positions.filter(
      (item) => item.freedom === highestValue
    );

    return collectionOfEqualValue.map((item) => item.position);
  }

  setNextPosition(geese) {
    const positions = this.getPositionsByMaxFreedom(geese);

    const selected = positions.length === 1 ? 0 : getRandomIndex(positions);
    this.position = positions[selected];
  }
}
