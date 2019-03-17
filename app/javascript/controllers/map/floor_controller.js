import { Controller } from 'stimulus'
import _ from 'underscore'
import PIXI from 'lib/pixi'

require('lib/polyfills/closest')

export default class extends Controller {
  
  get id () { return this.element.id }
  
  get parent ()   { return this.canvas.viewport }
  get viewport () { return this.parent }
  
  get pixi () { return this.canvas.pixi }
  
  get canvas () {
    return this._canvas || (
      this._canvas =
        this.application
            .getControllerForElementAndIdentifier(
              this.element.closest('[data-controller*="map--canvas"]'),
              'map--canvas'
            )
    )
  }
  
  get backgrounds () { 
    return _.compact(
      [
        ...this.element.querySelectorAll('[data-controller*="map--background"]')
      ].map(
        (element) => this.application.getControllerForElementAndIdentifier(element, 'map--background')
      )
    )
  }
  
  get characters () {
    return _.compact(
      [
        ...this.element.querySelectorAll('[data-controller*="map--character"]')
      ].map(
        (element) => this.application.getControllerForElementAndIdentifier(element, 'map--character')
      )
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
    this.active     = false
    
    this.container = this.parent.addChild(new PIXI.Container())
    this.contents  = this.container.addChild(new PIXI.Container())
    
    this.addBackgroundLayer()
    this.addCharacterLayer()
    this.addGridLayer()
    
    this.addVisionMask()
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
    this.vision = new PIXI.Graphics()
    
    this.container.addChild(this.vision)
    this.contents.mask = this.vision
    
    this.vision.clear()
               .beginFill(0xffffff, 1)
               .drawRect(0, 0, this.width, this.height)
  }
  
  addBackgroundLayer () {
    this.backgroundLayer = new PIXI.Container()
    this.contents.addChild(this.backgroundLayer)
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
    
    this.contents.addChild(this.gridLayer)
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
    let vision = this.vision.clear()
                     .beginFill(0xffffff, 1)
    
    for (let character of this.characters) {
      vision.drawCircle(
        character.x + (character.dragging ? 0 : character.width / 2),
        character.y + (character.dragging ? 0 : character.height / 2),
        4 * 50,
        4 * 50
      )
    }
    
    vision.endFill()
  }
}
