import Die   from 'lib/dice/die'
import THREE from 'lib/three'

export default class extends Die {
  constructor(options) {
    super(options);
    
    this.tab = -0.1;
    this.af = Math.PI * 7 / 6;
    this.chamfer = 0.96;
    this.vertices = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
    this.faces = [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];
    this.scaleFactor = 1.2;
    this.values = 4;
    this.faceTexts = [[], ['0', '0', '0'], ['2', '4', '3'], ['1', '3', '4'], ['2', '1', '4'], ['1', '2', '3']];
    this.mass = 300;
    this.inertia = 5;
    this.invertUpside = true;
    
    this.create();
  }
  
  shiftUpperValue(toValue) {
    let fromValue = this.getUpsideValue()
    
    if (toValue != fromValue) {
      super.shiftUpperValue(toValue)
      
      // to shift faces on a d4, we need to alter faceTexts and recreate the textures from it
      let num = toValue - fromValue;
      if (num < 0) num += 4;
      this.faceTexts = [
        [[], [0, 0, 0], [2, 4, 3], [1, 3, 4], [2, 1, 4], [1, 2, 3]],
        [[], [0, 0, 0], [2, 3, 4], [3, 1, 4], [2, 4, 1], [3, 2, 1]],
        [[], [0, 0, 0], [4, 3, 2], [3, 4, 1], [4, 2, 1], [3, 1, 2]],
        [[], [0, 0, 0], [4, 2, 3], [1, 4, 3], [4, 1, 2], [1, 3, 2]]
      ][num];
      this.object.material = this.getMaterials()
    }
  }
  
  createTextTexture (text, color, backColor) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let ts = this.calculateTextureSize(this.size / 2 + this.size * 2) * 2;
    canvas.width = canvas.height = ts;
    context.font = ts / 5 + "pt Arial";
    context.fillStyle = backColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = color;
    for (let i in text) {
      context.fillText(text[i], canvas.width / 2,
        canvas.height / 2 - ts * 0.3);
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(Math.PI * 2 / 3);
      context.translate(-canvas.width / 2, -canvas.height / 2);
    }
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };
}