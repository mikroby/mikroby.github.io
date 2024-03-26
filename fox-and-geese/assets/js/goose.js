export class Goose {
  static startPattern = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  static index = 0;

  constructor() {
    this.position = Goose.startPattern[Goose.index];
    Goose.index++;
  }
}
