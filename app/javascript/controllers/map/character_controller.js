import ObjectController from 'controllers/map/object_controller'
import PIXI from 'lib/pixi'
import Draggable from 'lib/map/draggable'
import Caster from 'lib/map/visibility/caster'
import _ from 'underscore'

export default class extends Draggable(ObjectController) {
  
  get form () {
    let htmlId  = this.data.get('form')
    let element = document.getElementById(htmlId)
    return this.controllerFor(element, 'form--map-character')
  }
  
  get floor () { return this._floor || (this._floor = this.findParentController('map--floor')) }
  
  get canvas ()   { return this.floor.canvas }
  get parent ()   { return this.canvas.viewport }
  get viewport () { return this.parent }
  
  get lightColor     () { return parseInt((this.data.get('lightColor') || '#ffffff').replace('#', '0x')) }
  get dimLightRadius () { return parseInt(this.data.get('dimLightRadius') || 40) }
  get lightRadius    () { return parseInt(this.data.get('lightRadius')    || 20) }
  
  get caster () {
    return this._caster || (
      this._caster = new Caster(
        this.center,
        [this.floor.polygon, ...this.floor.obstacles], {
        lightRadius: (this.dimLightRadius / this.floor.scale) * this.floor.gridSize
      })
    )
  }
  
  get spriteURL () {
    return this.data.get('sprite')
  }
  
  connect () {
    if (!this.floor) return
    
    this.updateForm = _.throttle(
      this.updateForm.bind(this), 50, {
      leading:  false,
      trailing: true
    })
    
    this.container = new PIXI.Container()
    
    if (this.spriteURL.length) {
      this.addSprite()
      this.sprite.on('pointerdown', this.showForm.bind(this))
      
      this.setupDraggable(this.sprite)
      this.enableDragging()
    }
    
    this.addLight()
    
    this.draw()
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
  
  updateForm () {
    if (this.form) {
      let form = this.form
      
      form.width  = this.width
      form.height = this.height
      form.x      = this.x
      form.y      = this.y
    }
  }
  
  showForm () {
    if (this.form) this.form.show()
  }
  
  addLight () {
    let light = new PIXI.Graphics()
    
    light.beginFill(this.lightColor, 0.1)
    this.drawLight(light)
    light.endFill()
    
    this.container.addChild(light)
    this.light = light
  }
  
  draw() {
    this.floor.characterLayer.addChild(this.container)
    this.sizeUpdated()
    this.locationUpdated()
  }
  
  undraw () {
    this.floor.characterLayer.removeChild(this.container)
  }
  
  sizeUpdated () {
    if (this.sprite) {
      this.sprite.width  = this.width
      this.sprite.height = this.height
    }
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
      this.drawLight(this.light.beginFill(this.lightColor, 0.1))
    }
    
    if (this.floor) {
      this.floor.updateFieldOfVision()
    }
  }
  
  onDragEnd (event) {
    if (super.onDragEnd) super.onDragEnd(event)
    _.defer(this.updateForm.bind(this))
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
