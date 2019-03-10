import { Controller } from 'stimulus'
import PIXI from 'lib/pixi'

export default class extends Controller {
  
  get floorElement () {
    return this.element.closest('[data-controller*="map--floor"]')
  }
  
  get floor () {
    return this._floor || (
      this._floor = this.application.getControllerForElementAndIdentifier(this.floorElement, 'map--floor')
    )
  }
  
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
  }
  
  disconnect () {
    this.undraw()
  }
  
  draw() {
    this.floor.background.addChild(this.sprite)
  }
  
  undraw () {
    this.floor.background.removeChild(this.sprite)
  }
}
