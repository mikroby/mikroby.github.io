import { Board } from "./board.js";

export class Fox {
  transposablePositions = [];
  position;

  constructor() {
  }

  findTransposablePositions(geese) {
    this.transposablePositions = Board.getEmptyNeighborPositions(
      this,
      ...geese
    );
  }

  getNextPosition(){
    
  }
}
