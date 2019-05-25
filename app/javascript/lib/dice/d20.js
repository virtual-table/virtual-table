import Die from 'lib/dice/die'

export default class extends Die {
  constructor(options) {
    super(options);
    
    let t = (1 + Math.sqrt(5)) / 2;
    
    this.tab = -0.2;
    this.af = -Math.PI / 4 / 2;
    this.chamfer = 0.955;
    this.vertices = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
    this.faces = [[0, 11, 5, 1], [0, 5, 1, 2], [0, 1, 7, 3], [0, 7, 10, 4], [0, 10, 11, 5],
    [1, 5, 9, 6], [5, 11, 4, 7], [11, 10, 2, 8], [10, 7, 6, 9], [7, 1, 8, 10],
    [3, 9, 4, 11], [3, 4, 2, 12], [3, 2, 6, 13], [3, 6, 8, 14], [3, 8, 9, 15],
    [4, 9, 5, 16], [2, 4, 11, 17], [6, 2, 10, 18], [8, 6, 7, 19], [9, 8, 1, 20]];
    this.scaleFactor = 1;
    this.values = 20;
    this.faceTexts = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8',
      '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    this.textMargin = 1.0;
    this.mass = 400;
    this.inertia = 6;
    
    this.create();
  }
}