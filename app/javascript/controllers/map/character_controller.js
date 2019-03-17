import { Controller } from 'stimulus'
import PIXI from 'lib/pixi'
import Draggable from 'lib/map/draggable'

export default class extends Draggable(Controller) {
  
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
  
  get x ()  {
    return parseInt(this.data.get('x'))
  }
  set x (v) {
    this.data.set('x', v)
    if (this.sprite) this.sprite.x = parseInt(v)
  }
  
  get y () {
    return parseInt(this.data.get('y'))
  }
  set y (v) {
    this.data.set('y', v)
    if (this.sprite) this.sprite.y = parseInt(v)
  }
  
  get width () {
    return parseInt(this.data.get('width'))
  }
  
  get height () {
    return parseInt(this.data.get('height'))
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
    
    
    this.setupDraggable(this.sprite)
    this.enableDragging()
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
}
