export default (superclass) => class extends superclass {
  
  get mapController () {
    if (typeof this._mapController === 'undefined') {
      this._mapController = this.findMapController()
    }
    
    return this._mapController
  }
  
  get mapModeSupportsDragging () {
    if (this.mapController) {
      return ['editor', 'player'].includes(this.mapController.mode)
    } else {
      return true
    }
  }
  
  get draggingEnabled ()      { return this._draggingEnabled && this.mapModeSupportsDragging }
  set draggingEnabled (value) { this._draggingEnabled = value }
  
  get offsetLeft () {
    let [ centerLeft, centerTop ] = this.center
    return centerLeft - this.x
  }
  
  get offsetTop () {
    let [ centerLeft, centerTop ] = this.center
    return centerTop - this.y
  }
  
  setupDraggable (sprite) {
    sprite.on('pointerdown',      this.onDragStart.bind(this))
          .on('pointerup',        this.onDragEnd.bind(this))
          .on('pointerupoutside', this.onDragEnd.bind(this))
          .on('pointermove',      this.onDragMove.bind(this))
    
    this.draggable = sprite
  }
  
  enableDragging () {
    this.draggable.interactive = true
    this.draggingEnabled = true
  }
  
  disableDragging () {
    this.draggable.interactive = false
    this.draggingEnabled = false
  }
  
  onDragStart (event) {
    if (this.draggingEnabled) {
      if (this.canvas) this.canvas.pauseViewport()
      
      this.dragging = true
      this.draggingData = event.data
      
      this.draggable.alpha = 0.5
      
      let newPosition = this.draggingData.getLocalPosition(this.draggable.parent)
      this.x = newPosition.x - this.offsetLeft
      this.y = newPosition.y - this.offsetTop
    }
  }
  
  onDragEnd (event) {
    if (this.draggingEnabled) {
      if (this.canvas) this.canvas.resumeViewport()
      
      this.dragging = false
      this.draggable.alpha = 1
      
      if (event.data) this.draggingData = event.data
      
      let newPosition = this.draggingData.getLocalPosition(this.draggable.parent)
      this.x = newPosition.x - this.offsetLeft
      this.y = newPosition.y - this.offsetTop
      
      this.draggingData = null
    }
  }
  
  onDragMove (event) {
    if (this.draggingEnabled && this.dragging) {
      let newPosition = this.draggingData.getLocalPosition(this.draggable.parent)
      this.x = newPosition.x - this.offsetLeft
      this.y = newPosition.y - this.offsetTop
    }
  }
}
