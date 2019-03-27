import Grid from 'lib/map/grid/grid'

export default class extends Grid {
  pathForTile(column, row) {
    let left   = column * this.tileSize
    let right  = left + this.tileSize
    let top    = row * this.tileSize
    let bottom = top + this.tileSize
    
    /*
     * 1 ┏━━┓ 2
     *   ┃  ┃
     * 4 ┗━━┛ 3
     */
    let path = [
      [left, top],     [right, top],
      [right, bottom], [left, bottom],
      [left, top]
    ]
    
    return path
  }
  
  drawTile(graphics, column, row) {
    let path = this.pathForTile(column, row)
    
    // Don't draw left border after first column
    if (column > 0) path.shift()
    
    // Don't draw top border after first row
    if (row > 0) path.pop()
    
    // Draw lines:
    let start = path.shift()
    
    graphics.moveTo(start[0], start[1])
    for (let coordinates of path) graphics.lineTo(...coordinates)
    
    return graphics
  }
}