import Grid from 'lib/map/grid/grid'
// https://codepen.io/zeakd/pen/NdMBgB
export default class extends Grid {
  get width  () { return this.tileWidth * this.columns }
  
  constructor (columns, rows, size) {
    super(columns, rows, size)
    
    this.tileHeight = size
    this.tileRadius = this.tileHeight / Math.sqrt(3)
    this.tileWidth  = this.tileDiameter = this.tileRadius * 2
  }
  
  pathForTile(column, row) {
    const top    = column % 2 ? (this.tileHeight / 2) + row * this.tileHeight : row * this.tileHeight
    const middle = top + (this.tileHeight / 2)
    const bottom = top + this.tileHeight
    
    const left        = this.tileWidth * column - (column * this.tileRadius / 2)
    const right       = left + this.tileWidth
    const centerLeft  = left + this.tileRadius / 2
    const centerRight = right - this.tileRadius / 2
    
    /*
     *    2 3
     *  1 /‾\
     *    \_/ 4
     *    6 5
     */
    let path = [
      [left, middle],
      [centerLeft, top],
      [centerRight, top],
      [right, middle],
      [centerRight, bottom],
      [centerLeft, bottom],
      [left, middle]
    ]
    
    return path
  }
  
  drawTile(graphics, column, row) {
    let path = this.pathForTile(column, row)
    
    // Draw lines:
    let start = path.shift()
    
    graphics.moveTo(start[0], start[1])
    for (let coordinates of path) graphics.lineTo(...coordinates)
    
    return graphics
  }
}