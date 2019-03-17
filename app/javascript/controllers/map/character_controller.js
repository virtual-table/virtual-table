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
    
    this.addCaster()
    this.addLight()
    
    this.draw()
    
    this.floor.updateFieldOfVision()
  }
  
  disconnect () {
    this.undraw()
  }
  
  addCaster () {
    this.caster = new Caster(
      [this.x, this.y],
      [this.floor.polygon, ...this.floor.obstacles]
    )
  }
  
  addSprite () {
    let sprite = PIXI.Sprite.from(this.spriteURL)
    
    sprite.anchor.set(0)
    
    sprite.width  = this.width
    sprite.height = this.height
    sprite.x      = this.x
    sprite.y      = this.y
    
    this.container.addChild(sprite)
    this.sprite = sprite
  }
  
  addLight () {
    let light = new PIXI.Graphics()
    
    light.beginFill(0xFFFFAA, 0.2)
    this.drawVision(light)
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
      this.sprite.x = this.x
      this.sprite.y = this.y
    }
    
    if (this.caster) {
      this.caster.origin = [this.x, this.y]
    }
    
    if (this.light) {
      this.light.clear().beginFill(0xFFFFAA, 0.2)
      this.drawVision(this.light)
      this.light.endFill()
    }
    
    if (this.floor) {
      this.floor.updateFieldOfVision()
    }
  }
  
  drawVision (graphics) {
    for (let polygon of this.caster.cast()) {
      var points = polygon.points
      graphics.moveTo(points[points.length-1].x, points[points.length-1].y)
      for (var i=0; i<points.length; i++) graphics.lineTo(points[i].x, points[i].y)
    }
  }
}
