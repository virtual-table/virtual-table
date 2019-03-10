import { Controller } from 'stimulus'
import PIXI from 'lib/pixi'

export default class extends Controller {
  
  static targets = ['canvas']
  
  get worldWidth () {
    return parseInt(this.data.get('width'))
  }
  
  get worldHeight () {
    return parseInt(this.data.get('height'))
  }
  
  get availableHeight () {
    let position = this.canvasTarget.getBoundingClientRect()
    return window.innerHeight - position.top - 48
  }
  
  get availableWidth () {
    return this.canvasTarget.clientWidth
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
        .pinch()
        .wheel()
        .decelerate()
        .clamp({ direction: 'all' })
        .clampZoom({
          minWidth:  this.worldWidth  / 4,
          minHeight: this.worldHeight / 4,
          maxWidth:  this.worldWidth  * 4,
          maxHeight: this.worldHeight * 4
        })
  }
  
  resize () {
    this.canvasTarget.style.height = `${this.availableHeight}px`
    if (this.pixi) {
      this.pixi.renderer.resize(this.availableWidth, this.availableHeight);
    }
    if (this.viewport) {
      this.viewport.resize(this.availableWidth, this.availableHeight, 1000, 1000)
    }
  }
}
