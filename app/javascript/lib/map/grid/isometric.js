import Grid from 'lib/map/grid/grid'

export default class extends Grid {
  get height  () { return this.tileHeight * this.rows }
  
  constructor (columns, rows, size) {
    super(columns, rows, size)
    
    this.tileWidth  = size * 2
    this.tileHeight = size
  }
  
  cornersForTile(column, row) {
    let left   = column * this.tileWidth
    let center = left + this.tileWidth / 2
    let right  = left + this.tileWidth
    let top    = row * this.tileHeight
    let middle = top + this.tileHeight / 2
    let bottom = top + this.tileHeight
    
    /*
     *   1
     *   ╱╲ 2
     * 4 ╲╱ 
     *    3
     */
    let corners = [
      [center, top],    [right,  middle],
      [center, bottom], [left,   middle]
    ]
    
    return corners
  }
}