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
  }
  
  disconnect () {
    this.undraw()
  }
  
  locationUpdated () {
    if (this.sprite) {
      this.sprite.x = this.x
      this.sprite.y = this.y
    }
  }
  
  draw() {
    this.floor.backgroundLayer.addChild(this.sprite)
  }
  
  undraw () {
    this.floor.backgroundLayer.removeChild(this.sprite)
  }
}
