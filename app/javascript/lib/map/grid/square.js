import Grid from 'lib/map/grid/grid'

export default class extends Grid {
  verticesForTile(column, row) {
    let left   = column * this.tileSize
    let right  = left + this.tileSize
    let top    = row * this.tileSize
    let bottom = top + this.tileSize
    
    /*
     * 1 ┏━━┓ 2
     *   ┃  ┃
     * 4 ┗━━┛ 3
     */
    let vertices = [
      [left, top],     [right, top],
      [right, bottom], [left, bottom]
    ]
    
    return vertices
  }
}