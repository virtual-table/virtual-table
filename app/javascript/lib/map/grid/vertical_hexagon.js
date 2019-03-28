import Grid from 'lib/map/grid/grid'

export default class extends Grid {
  get height  () { return this.tileWidth * this.columns }
  
  constructor (columns, rows, size) {
    super(columns, rows, size)
    
    this.tileWidth  = size
    this.tileRadius = this.tileWidth / Math.sqrt(3)
    this.tileHeight = this.tileDiameter = this.tileRadius * 2
  }
  
  cornersForTile(column, row) {
    const top          = row * this.tileHeight - (row * (this.tileRadius / 2))
    const bottom       = top + this.tileHeight
    const middleTop    = top + (this.tileRadius / 2)
    const middleBottom = bottom - (this.tileRadius / 2)
    
    const left   = row % 2 ? this.tileWidth * column + (this.tileWidth / 2) : this.tileWidth * column
    const right  = left + this.tileWidth
    const center = left + (this.tileWidth / 2)
    
    /*
     *   2
     * 1 ╱╲ 3
     *  │  │
     * 6 ╲╱ 4
     *    5
     */
    let corners = [
      [left,   middleTop], [center, top],
      [right,  middleTop], [right,  middleBottom],
      [center, bottom],    [left,   middleBottom]
    ]
    
    return corners
  }
}