import ObjectController from 'controllers/map/object_controller'
import PIXI from 'lib/pixi'
import _ from 'underscore'

export default class extends ObjectController {
  
  get label ()  { return this.data.get('label') }
  set label (v) { this.data.set('label', v)     }
  
  get visible ()  { return this.data.get('visible') == 'true'      }
  set visible (v) { this.data.set('visible', v ? 'true' : 'false') }
  
  get canvas () {
    return this._canvas || (this._canvas = this.findParentController('map--canvas'))
  }
  
  get pixi () {
    return this.canvas && this.canvas.pixi
  }
  
  get viewport () {
    return this.canvas && this.canvas.viewport
  }
  
  connect () {
    _.defer(this.setupTicker.bind(this))
    _.defer(this.addCursor.bind(this))
  }
  
  setupTicker () {
    this.ticker = new PIXI.ticker.Ticker()
    this.ticker.start()
    //this.ticker.speed = this.frameRate / this.ticker.FPS
  }
  
  addCursor () {
    let container = this.container = this.viewport.addChild(new PIXI.Container())
    container.x = this.x
    container.y = this.y
    
    let cursor = this.cursor = container.addChild(new PIXI.Graphics())
    cursor.beginFill(0x000000)
          .lineStyle(1, 0xFFFFFF, 1)
          .drawPolygon(0, 1,0, 20, 4, 16, 7, 24, 10, 22, 7, 14, 14, 14, 0, 1)
    
    let label = this.cursorLabel = container.addChild(new PIXI.Text(this.label, {
      fontFamily: 'Arial',
      fontSize:   12,
      fill:       0x000000
    }))
    label.x = 7
    label.y = 28
    
    this.destination = { x: this.x, y: this.y }
    this.ticker.add(this.moveCursorToDestination.bind(this))
    
    this.updatePosition(this.x, this.y)
  }
  
  // EVENTS:
  
  attach (object) {
    this.attachment = object
    if (object.attachedToCursor) object.attachedToCursor()
  }
  
  detach (object) {
    this.attachment = null
    if (object.detachedFromCursor) object.detachedFromCursor()
  }
  
  // ACTIONS:
  
  updatePosition (x, y) {
    this.x = x
    this.y = y
    
    let container = this.container
    if (!container) return
    
    container.visible = this.visible && !this.isOutOfBounds(x, y)
    
    if (container.visible) {
      this.destination.x = x
      this.destination.y = y
    } else {
      this.container.x = x
      this.container.y = y
      
      this.updateAttachmentPositions(x, y)
    }
  }
  
  moveCursorToDestination (deltaTime) {
    let container   = this.container
    let destination = this.destination
    
    let dx  = destination.x - container.x
    let adx = Math.abs(dx)
    let dy  = destination.y - container.y
    let ady = Math.abs(dy)
    
    if (adx + ady < 1) {
      container.x = destination.x
      container.y = destination.y
      
      this.updateAttachmentPositions(destination.x, destination.y)
      
      return
    }
    
    let speed     = 10
    let angle     = Math.atan2(dy, dx)
    let xVelocity = Math.cos(angle) * (adx / speed)
    let yVelocity = Math.sin(angle) * (ady / speed)
    
    container.x += xVelocity
    container.y += yVelocity
    
    this.updateAttachmentPositions(container.x, container.y)
  }
  
  // HELPERS:
  
  updateAttachmentPositions (x, y) {
    if (this.attachment && this.attachment.updatePosition)
      this.attachment.updatePosition(x, y)
  }
  
  isOutOfBounds (x, y) {
    if (x < 0 || y < 0) return true
    
    let width  = this.canvas.worldWidth,
        height = this.canvas.worldHeight
    
    if (x > width || y > height) return true
    
    return false
  }
}
