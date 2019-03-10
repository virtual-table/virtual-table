import { Controller } from 'stimulus'
import PIXI from 'lib/pixi'

require('lib/polyfills/closest')

export default class extends Controller {
  
  get canvasElement () { return this.element.closest('[data-controller*="map--canvas"]') }
  get canvas        () {
    return this._canvas || (
      this._canvas = this.application.getControllerForElementAndIdentifier(this.canvasElement, 'map--canvas')
    )
  }
  
  get backgroundColor () { return parseInt((this.data.get('backgroundColor') || '#ffffff').replace('#', '0x')) }
  
  get gridSize    () { return parseInt(this.data.get('gridSize')) }
  get gridWidth   () { return 1 }
  get gridColor   () { return parseInt((this.data.get('gridColor') || '#c0c0c0').replace('#', '0x')) }
  get gridOpacity () { return parseFloat(this.data.get('gridOpacity') || 0.5) }
  
  get columns    () { return parseInt(this.data.get('columns')) }
  get rows       () { return parseInt(this.data.get('rows'))    }
  get width      () { return this.columns * this.gridSize       }
  get height     () { return this.rows * this.gridSize          }
  
  connect () {
    this.container  = this.canvas.viewport.addChild(new PIXI.Container())
    
    this.background = this.container.addChild(new PIXI.Container())
    this.drawBackgroundColor()
    
    this.grid = this.container.addChild(new PIXI.Container())
    this.drawGrid()
  }
  
  drawBackgroundColor () {
    let backgroundColor    = this.background.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    backgroundColor.tint   = this.backgroundColor
    backgroundColor.width  = this.width
    backgroundColor.height = this.height
    backgroundColor.position.set(0, 0)
  }
  
  drawGrid () {
    let graphics = this.grid.addChild(new PIXI.Graphics())
    graphics.lineStyle(this.gridWidth, this.gridColor, this.gridOpacity)
    
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        let path = this.generateGridTile(x, y)
        
        // Don't draw left border after first column
        if (y > 0) path.shift()
        
        // Don't draw top border after first row
        if (x > 0) path.pop()
        
        // Draw lines:
        let start = path.shift()
        graphics.moveTo(start[0], start[1])
        for (let coordinates of path) {
          graphics.lineTo(...coordinates)
        }
      }
    }
  }
  
  generateGridTile(x, y) {
    let left   = x * this.gridSize
    let right  = (x + 1) * this.gridSize
    let top    = y * this.gridSize
    let bottom = (y + 1) * this.gridSize
    
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
}
