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
    this.faces = []
    
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this.faces.push(this.verticesForTile(column, row))
      }
    }
    
    this.vertices = _.uniq(_.flatten(this.faces, true))
    this.edges    = _.uniq(_.flatten(_.map(this.faces, (vertices) => {
      let edges = []
      
      for (let i = 1; i < vertices.length; i++) {
        edges.push(
          [
            vertices[i - 1],
            vertices[i]
          ].sort(this.sortByPosition)
        )
      }
      
      edges.push(
        [
          vertices[vertices.length - 1],
          vertices[0]
        ].sort(this.sortByPosition)
      )
      
      return edges
    }), true), _.iteratee((edge) => _.flatten(edge).join(',')))
  }
  
  drawGrid (graphics) {
    if (!this.edges) this.preprocess()
    this.edges.forEach((edge) => graphics.moveTo(...edge[0]).lineTo(...edge[1]))
  }
  
  sortByPosition (a, b) {
    let [ ax, ay ] = a
    let [ bx, by ] = b
    
    return ax - bx || ay - by
  }
}