import ApplicationController from 'controllers/application_controller'
import _ from 'underscore'
import PIXI from 'lib/pixi'
import HorizontalHexGrid from 'lib/map/grid/horizontal_hexagon'
import IsometricGrid from 'lib/map/grid/isometric'
import VerticalHexGrid from 'lib/map/grid/vertical_hexagon'
import SquareGrid from 'lib/map/grid/square'

require('lib/polyfills/closest')

export default class extends ApplicationController {
  
  get id () { return this.element.id }
  
  get player () {
    return this._player || (
      this._player = this.findParentController('map-player') ||
                     this.findParentController('map-editor')
    )
  }
  
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
  
  get rooms () {
    return this.findChildControllers('map--room')
  }
  
  get backgroundColor () { return parseInt((this.data.get('backgroundColor') || '#ffffff').replace('#', '0x')) }
  
  get scale () { return parseInt(this.data.get('scale') || 5) }
  
  get grid () {
    return this._grid || (
      this._grid = new this.gridType(this.columns, this.rows, this.gridSize)
    )
  }
  
  get gridType () {
    switch (this.data.get('gridType')) {
      case 'horizontal-hex':
        return HorizontalHexGrid
        break
      
      case 'isometric':
        return IsometricGrid
        break
      
      case 'vertical-hex':
        return VerticalHexGrid
        break
      
      case 'square':
      default:
        return SquareGrid
    }
  }
  
  get gridSize    () { return parseInt(this.data.get('gridSize')) }
  get gridWidth   () { return 1 }
  get gridColor   () { return parseInt((this.data.get('gridColor') || '#c0c0c0').replace('#', '0x')) }
  get gridOpacity () { return parseFloat(this.data.get('gridOpacity') || 0.5) }
  
  get columns    () { return parseInt(this.data.get('columns')) }
  get rows       () { return parseInt(this.data.get('rows'))    }
  
  get width      () { return this.grid ? this.grid.width  : this.columns * this.gridSize }
  get height     () { return this.grid ? this.grid.height : this.rows * this.gridSize    }
  
  get globalIllumination () { return this.data.get('globalIllumination') == 'true' }
  
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
    return _.flatten(this.rooms.map((room) => room.obstacles))
  }
  
  connect () {
    this.pixi.renderer.backgroundColor = this.backgroundColor
    
    this.container   = this.parent.addChild(new PIXI.Container())
    this.illuminated = this.container.addChild(new PIXI.Container())
    this.contents    = this.illuminated.addChild(new PIXI.Container())
    
    this.addBackgroundLayer()
    
    if (this.player.mode == 'editor') {
      this.addGameMasterLayer()
    }
    
    this.addCharacterLayer()
    this.addGridLayer()
    
    if (this.player.mode == 'player') {
      this.addLightMask()
      this.addVisionMask()
    }
    
    _.defer(this.updateFieldOfVision.bind(this))
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
  
  addBackgroundLayer () {
    this.backgroundLayer = new PIXI.Container()
    this.contents.addChild(this.backgroundLayer)
  }
  
  addGameMasterLayer () {
    this.gameMasterLayer = new PIXI.Container()
    this.container.addChild(this.gameMasterLayer)
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
    
    this.grid.drawGrid(graphics)
    
    this.container.addChild(this.gridLayer)
  }
  
  addLightMask () {
    let light = new PIXI.Graphics()
    
    this.container.addChild(light)
    this.contents.mask = light
    
    light.clear()
          .beginFill(0xFFFFFF, 1)
          .drawRect(0, 0, this.width, this.height)
    
    this.lightMask = light
  }
  
  addVisionMask () {
    let vision = new PIXI.Graphics()
    
    this.container.addChild(vision)
    this.illuminated.mask = vision
    
    vision.clear()
          .beginFill(0xFFFFFF, 1)
          .drawRect(0, 0, this.width, this.height)
    
    this.visionMask = vision
  }
  
  updateObstacles () {
    for (let character of this.characters) {
      if (character.caster) {
        character.caster.obstacles = [this.polygon, ...this.obstacles]
        character.locationUpdated()
      }
    }
    
    this.updateFieldOfVision()
  }
  
  updateFieldOfVision () {
    if (this.lightMask) {
      let light = this.lightMask
                      .clear()
                      .beginFill(0xFFFFFF, 1)
      
      if (this.globalIllumination) {
        light.drawRect(0, 0, this.width, this.height)
      } else {
        for (let character of this.characters) {
          character.drawLight(light)
        }
        
        // for (let lighting of this.lights) {
        //   lighting.drawLight(light)
        // }
      }
    }
    
    if (this.visionMask) {
      let vision = this.visionMask
                       .clear()
                       .beginFill(0xFFFFFF, 1)
      
      for (let character of this.characters) {
        character.drawVision(vision)
      }
      
      vision.endFill()
    }
  }
}
