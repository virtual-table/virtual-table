import _ from 'underscore'

export default class {
  get width  () { return this.tileSize * this.columns }
  get height () { return this.tileSize * this.rows    }
  
  constructor (columns, rows, size) {
    this.columns  = columns
    this.rows     = rows
    this.tileSize = size
  }
  
  preprocess () {
    this.tiles = []
    
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this.tiles.push(this.cornersForTile(column, row))
      }
    }
    
    this.corners = _.uniq(_.flatten(this.tiles, true))
    this.lines   = _.uniq(_.flatten(_.map(this.tiles, (corners) => {
      let lines = []
      
      for (let i = 1; i < corners.length; i++) {
        lines.push(
          [
            corners[i - 1],
            corners[i]
          ].sort(this.sortByPosition)
        )
      }
      
      lines.push(
        [
          corners[corners.length - 1],
          corners[0]
        ].sort(this.sortByPosition)
      )
      
      return lines
    }), true), _.iteratee((line) => _.flatten(line).join(',')))
  }
  
  drawGrid (graphics) {
    if (!this.lines) this.preprocess()
    this.lines.forEach((line) => graphics.moveTo(...line[0]).lineTo(...line[1]))
  }
  
  sortByPosition (a, b) {
    let [ ax, ay ] = a
    let [ bx, by ] = b
    
    return ax - bx || ay - by
  }
}