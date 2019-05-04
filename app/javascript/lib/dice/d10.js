import DiceObject from 'lib/dice/dice_object'

export default class extends DiceObject {
  constructor(options) {
    super(options);
    
    this.tab = 0;
    this.af = Math.PI * 6 / 5;
    this.chamfer = 0.945;
    this.vertices = [];
    this.faces = [[5, 7, 11, 0], [4, 2, 10, 1], [1, 3, 11, 2], [0, 8, 10, 3], [7, 9, 11, 4],
    [8, 6, 10, 5], [9, 1, 11, 6], [2, 0, 10, 7], [3, 5, 11, 8], [6, 4, 10, 9],
    [1, 0, 2, -1], [1, 2, 3, -1], [3, 2, 4, -1], [3, 4, 5, -1], [5, 4, 6, -1],
    [5, 6, 7, -1], [7, 6, 8, -1], [7, 8, 9, -1], [9, 8, 0, -1], [9, 0, 1, -1]];
    
    for (let i = 0, b = 0; i < 10; ++i, b += Math.PI * 2 / 10) {
      this.vertices.push([Math.cos(b), Math.sin(b), 0.105 * (i % 2 ? 1 : -1)]);
    }
    this.vertices.push([0, 0, -1]);
    this.vertices.push([0, 0, 1]);
    
    this.scaleFactor = 0.9;
    this.values = 10;
    this.faceTexts = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8',
      '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    this.textMargin = 1.0;
    this.mass = 350;
    this.inertia = 9;
    
    this.create();
  }
}
