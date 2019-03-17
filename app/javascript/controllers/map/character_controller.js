import ObjectController from 'controllers/map/object_controller'
import PIXI from 'lib/pixi'
import Draggable from 'lib/map/draggable'

export default class extends Draggable(ObjectController) {
  
  get floor () {
    return this._floor || (
      this._floor =
        this.application
            .getControllerForElementAndIdentifier(
              this.element.closest('[data-controller*="map--floor"]'),
              'map--floor'
            )
    )
  }
  
  get canvas ()   { return this.floor.canvas }
  get parent ()   { return this.canvas.viewport }
  get viewport () { return this.parent }
  
  get spriteURL () {
    return this.data.get('sprite')
  }
  
  connect () {
    if (!this.floor) return
    
    if (this.spriteURL.length) {
      this.sprite = PIXI.Sprite.from(this.spriteURL)
      
      this.sprite.anchor.set(0)
      
      this.sprite.width  = this.width
      this.sprite.height = this.height
      this.sprite.x      = this.x
      this.sprite.y      = this.y
      
      this.draw()
    }
    
    this.setupDraggable(this.sprite)
    this.enableDragging()
    
    this.floor.updateFieldOfVision()
  }
  
  disconnect () {
    this.undraw()
  }
  
  draw() {
    this.floor.characterLayer.addChild(this.sprite)
  }
  
  undraw () {
    this.floor.characterLayer.removeChild(this.sprite)
  }
  
  locationUpdated () {
    if (this.sprite) {
      this.sprite.x = this.x
      this.sprite.y = this.y
    }
    
    if (this.floor) {
      this.floor.updateFieldOfVision()
    }
  }
  
  drawVision (graphics) {
    graphics.drawCircle(
      this.x + (this.dragging ? 0 : this.width / 2),
      this.y + (this.dragging ? 0 : this.height / 2),
      4 * 50,
      4 * 50
    )
  }
}
