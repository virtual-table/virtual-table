import Die from 'lib/dice/die'

export default class extends Die {
  constructor(options) {
    super(options);
    
    this.tab = 0;
    this.af = -Math.PI / 4 / 2;
    this.chamfer = 0.965;
    this.vertices = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    this.faces = [[0, 2, 4, 1], [0, 4, 3, 2], [0, 3, 5, 3], [0, 5, 2, 4], [1, 3, 4, 5],
    [1, 4, 2, 6], [1, 2, 5, 7], [1, 5, 3, 8]];
    this.scaleFactor = 1;
    this.values = 8;
    this.faceTexts = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8',
      '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    this.textMargin = 1.2;
    this.mass = 340;
    this.inertia = 10;
    
    this.create();
  }
}