export default class {
  get width  () { return this.tileSize * this.columns }
  get height () { return this.tileSize * this.rows    }
  
  constructor (columns, rows, size) {
    this.columns  = columns
    this.rows     = rows
    this.tileSize = size
  }
  
  drawGrid (graphics) {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this.drawTile(graphics, column, row)
      }
    }
  }
}