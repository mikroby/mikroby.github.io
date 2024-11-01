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

  getMaxFreedom(geese) {
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

    return collectionOfEqualValue;
  }

  getUndefended(geese) {
    const undefendeds = [];

    geese.forEach((goose) => {
      const emptyPairs = Board.getInLineEmptyNeighborPositions(goose, ...geese);
      if (emptyPairs) {
        undefendeds.push({ goosePosition: goose.position, emptyPairs });
      }
    });

    return undefendeds.length > 0 ? undefendeds : undefined;
  }

  getCaptureables(undefendeds) {
    const captureables = undefendeds
      .map(({ goosePosition, emptyPairs }) => {
        const pair = emptyPairs.filter((pair) => pair.includes(this.position));
        const position =
          pair.length > 0
            ? pair[0].find((position) => position !== this.position)
            : undefined;

        return position
          ? { gooseToCapture: goosePosition, position }
          : undefined;
      })
      .filter((data) => data !== undefined);

    return captureables.length > 0 ? captureables : undefined;
  }

  getAttackables(undefendeds) {
    const attackables = undefendeds
      .map(({ goosePosition, emptyPairs }) => {
        const pair = emptyPairs.filter((pair) =>
          pair.some((position) => this.transposablePositions.includes(position))
        );
        const position =
          pair.length > 0
            ? pair[0].find((position) =>
                this.transposablePositions.includes(position)
              )
            : undefined;

        return position ? { goosePosition, position } : undefined;
      })
      .filter((data) => data !== undefined);

    return attackables.length > 0 ? attackables : undefined;
  }

  /** fox's actual logic to select next step */
  getNextPosition(geese) {
    let positions = this.getMaxFreedom(geese);

    const undefendedGeese = this.getUndefended(geese);

    if (undefendedGeese) {
      const captureableGeese = this.getCaptureables(undefendedGeese);
      const attackableGeese = this.getAttackables(undefendedGeese);

      if (captureableGeese) {
        positions = captureableGeese;
      } else if (attackableGeese) {
        positions = attackableGeese;
      }
    }

    const selected = positions.length === 1 ? 0 : getRandomIndex(positions);

    return positions[selected];
  }
}
