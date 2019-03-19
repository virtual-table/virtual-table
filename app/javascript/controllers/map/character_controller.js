import ObjectController from 'controllers/map/object_controller'
import PIXI from 'lib/pixi'
import Draggable from 'lib/map/draggable'
import Caster from 'lib/map/caster'
import _ from 'underscore'

export default class extends Draggable(ObjectController) {
  
  get floor () { return this._floor || (this._floor = this.findParentController('map--floor')) }
  
  get canvas ()   { return this.floor.canvas }
  get parent ()   { return this.canvas.viewport }
  get viewport () { return this.parent }
  
  get caster () {
    return this._caster || (
      this._caster = new Caster(
        this.center,
        [this.floor.polygon, ...this.floor.obstacles]
      )
    )
  }
  
  get spriteURL () {
    return this.data.get('sprite')
  }
  
  connect () {
    if (!this.floor) return
    
    this.container = new PIXI.Container()
    
    if (this.spriteURL.length) {
      this.addSprite()
      this.setupDraggable(this.sprite)
      this.enableDragging()
    }
    
    this.addLight()
    
    this.draw()
    this.locationUpdated()
  }
  
  disconnect () {
    this.undraw()
  }
  
  addSprite () {
    let sprite = PIXI.Sprite.from(this.spriteURL)
    
    sprite.anchor.set(0.5)
    
    sprite.width  = this.width
    sprite.height = this.height
    
    this.container.addChild(sprite)
    this.sprite = sprite
  }
  
  addLight () {
    let light = new PIXI.Graphics()
    
    light.beginFill(0xFFFFAA, 0.4)
    this.drawLight(light)
    light.endFill()
    
    this.container.addChild(light)
    this.light = light
  }
  
  draw() {
    this.floor.characterLayer.addChild(this.container)
  }
  
  undraw () {
    this.floor.characterLayer.removeChild(this.container)
  }
  
  locationUpdated () {
    if (this.sprite) {
      this.sprite.x = this.x + this.width  / 2
      this.sprite.y = this.y + this.height / 2
    }
    
    if (this.caster) {
      this.caster.origin = this.center
    }
    
    if (this.light) {
      this.light.clear()
      this.drawLight(this.light.beginFill(0xFFFFAA, 0.4)).endFill()
      this.drawVision(this.light.beginFill(0xFFAAFF, 0.2))
    }
    
    if (this.floor) {
      this.floor.updateFieldOfVision()
    }
  }
  
  drawLight (graphics) {
    this.caster.drawLight(graphics)
    return graphics
  }
  
  drawVision (graphics) {
    this.caster.drawVision(graphics)
    return graphics
  }
}
