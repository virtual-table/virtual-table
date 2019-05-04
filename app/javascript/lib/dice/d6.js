import DiceObject from 'lib/dice/dice_object'

export default class extends DiceObject {
  constructor(options) {
    super(options);

    this.tab = 0.1;
    this.af = Math.PI / 4;
    this.chamfer = 0.96;
    this.vertices = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
    this.faces = [[0, 3, 2, 1, 1], [1, 2, 6, 5, 2], [0, 1, 5, 4, 3],
    [3, 7, 6, 2, 4], [0, 4, 7, 3, 5], [4, 5, 6, 7, 6]];
    this.scaleFactor = 0.9;
    this.values = 6;
    this.faceTexts = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8',
      '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    this.textMargin = 1.0;
    this.mass = 300;
    this.inertia = 13;

    this.create();
  }
}