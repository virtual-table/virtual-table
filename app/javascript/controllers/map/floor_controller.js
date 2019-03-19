import ApplicationController from 'controllers/application_controller'
import _ from 'underscore'
import PIXI from 'lib/pixi'

require('lib/polyfills/closest')

export default class extends ApplicationController {
  
  get id () { return this.element.id }
  
  get parent ()   { return this.canvas.viewport }
  get viewport () { return this.parent }
  
  get pixi () { return this.canvas.pixi }
  
  get canvas () {
    return this._canvas || (this._canvas = this.findParentController('map--canvas'))
  }
  
  get backgrounds () { 
    return this.findChildControllers('map--background')
  }
  
  get characters () {
    return this.findChildControllers('map--character')
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
  
  get polygon   () {
    return new PIXI.Polygon([
      [0, 0], // top left
      [0, this.height], // bottom left
      [this.width, this.height], // bottom right
      [this.width, 0], // top right
      [0, 0] // top left
    ])
  }
  
  get obstacles () {
    return JSON.parse(this.data.get('obstacles')).map(
      (path) => new PIXI.Polygon(path)
    )
  }
  
  connect () {
    this.active     = false
    
    this.container = this.parent.addChild(new PIXI.Container())
    this.contents  = this.container.addChild(new PIXI.Container())
    
    this.addBackgroundLayer()
    this.addCharacterLayer()
    this.addObstacleLayer()
    this.addGridLayer()
    
    // this.addVisionMask()
    this.updateFieldOfVision()
  }
  
  disconnect () {
    this.parent.removeChild(this.container)
    this.pixi.ticker.remove(this.updateFieldOfSight)
  }
  
  hide () {
    this.parent.removeChild(this.container)
  }
  
  showAtLevel (level) {
    this.pixi.renderer.backgroundColor = this.backgroundColor
    this.parent.removeChild(this.container)
    this.parent.addChildAt(this.container, level)
  }
  
  addVisionMask () {
    let vision = new PIXI.Graphics()
    
    this.container.addChild(vision)
    this.contents.mask = vision
    
    vision.clear()
          .beginFill(0xffffff, 1)
          .drawRect(0, 0, this.width, this.height)
    
    this.vision = vision
  }
  
  addBackgroundLayer () {
    this.backgroundLayer = new PIXI.Container()
    this.contents.addChild(this.backgroundLayer)
  }
  
  addObstacleLayer () {
    this.obstacleLayer = new PIXI.Container()
    this.container.addChild(this.obstacleLayer)
    
    let graphics = new PIXI.Graphics()
    graphics.lineStyle(2, 0xFF0000, 1)
    
    graphics.drawPolygon(_.flatten(this.polygon.points))
    
    for (let polygon of this.obstacles) {
      graphics.drawPolygon(_.flatten(polygon.points))
    }
    
    this.obstacleLayer.addChild(graphics)
  }
  
  addCharacterLayer () {
    this.characterLayer = new PIXI.Container()
    this.contents.addChild(this.characterLayer)
  }
  
  addGridLayer () {
    this.gridLayer = new PIXI.Container()
    
    let graphics = this.gridLayer.addChild(new PIXI.Graphics())
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
    
    this.container.addChild(this.gridLayer)
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
  
  updateFieldOfVision () {
    if (this.vision) {
      let vision = this.vision.clear()
                       .beginFill(0xffffff, 0.5)
      
      for (let character of this.characters) {
        character.drawVision(vision)
      }
      
      vision.endFill()
    }
  }
}
