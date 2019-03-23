import ApplicationController from 'controllers/application_controller'
import PIXI from 'lib/pixi'

export default class extends ApplicationController {
  
  static targets = ['canvas']
  
  get worldWidth () {
    return parseInt(this.data.get('width'))
  }
  
  get worldHeight () {
    return parseInt(this.data.get('height'))
  }
  
  get availableHeight () {
    let position = this.canvasTarget.getBoundingClientRect()
    return window.innerHeight - position.top
  }
  
  get availableWidth () {
    let position = this.canvasTarget.getBoundingClientRect()
    return window.innerWidth - position.left
  }
  
  get floors () {
    return this.findChildControllers('map--floor')
  }
  
  get backgrounds () {
    return this.floors.map((floor) => floor.backgrounds).flat()
  }
  
  connect () {
    this.resize()
    
    this.setupPixi()
    this.setupViewport()
  }
  
  setupPixi () {
    this.pixi = new PIXI.Application({
      width:           this.availableWidth,
      height:          this.availableHeight,
      backgroundColor: 0xc0c0c0,
      resolution:      window.devicePixelRatio,
      autoResize:      true
    })
    this.canvasTarget.appendChild(this.pixi.view)
  }
  
  setupViewport () {
    this.viewport = new PIXI.Viewport({
      screenWidth:  this.availableWidth,
      screenHeight: this.availableHeight,
      worldWidth:   this.worldWidth,
      worldHeight:  this.worldHeight,
      interaction:  this.pixi.renderer.plugins.interaction
    })
    
    this.pixi.stage.addChild(this.viewport)
    this.viewport
        .drag()
        .pinch({ noDrag: true }) // .wheel()
        .decelerate()
        .clamp({ direction: 'all' })
        .clampZoom({
          minWidth:  this.worldWidth  / 6,
          minHeight: this.worldHeight / 6,
          maxWidth:  this.worldWidth  * 6,
          maxHeight: this.worldHeight * 6
        })
  }
  
  pauseViewport () {
    for (let plugin of ['drag', 'pinch']) {
      this.viewport.pausePlugin(plugin)
    }
  }
  
  resumeViewport () {
    for (let plugin of ['drag', 'pinch']) {
      this.viewport.resumePlugin(plugin)
    }
  }
  
  
  zoomIn () {
    this.viewport.zoomPercent(0.25, true)
  }
  
  zoomOut () {
    this.viewport.zoomPercent(-0.25, true)
  }
  
  resize () {
    this.canvasTarget.style.width  = 0
    this.canvasTarget.style.height = 0
    
    this.canvasTarget.style.height = `${this.availableHeight}px`
    this.canvasTarget.style.width  = `${this.availableWidth}px`
    if (this.pixi) {
      this.pixi.renderer.resize(this.availableWidth, this.availableHeight);
    }
    if (this.viewport) {
      this.viewport.resize(this.availableWidth, this.availableHeight, 1000, 1000)
    }
  }
}
