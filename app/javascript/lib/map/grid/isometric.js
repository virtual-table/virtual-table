import Grid from 'lib/map/grid/grid'

export default class extends Grid {
  get height  () { return this.tileHeight * this.rows }
  
  constructor (columns, rows, size) {
    super(columns, rows, size)
    
    // From Roll20:
    // To make an isometric map in photo editing or illustration software,
    // start with a grid, rotate it by 45 degrees and scale it vertically
    // by 57.7%.
    this.tileWidth  = size * 1.733102253
    this.tileHeight = size
  }
  
  verticesForTile(column, row) {
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
    let vertices = [
      [center, top],    [right,  middle],
      [center, bottom], [left,   middle]
    ]
    
    return vertices
  }
}