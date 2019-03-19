export default (superclass) => class extends superclass {
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
      this.draggable.anchor.set(0.5)
      
      let newPosition = this.draggingData.getLocalPosition(this.draggable.parent)
      this.x = newPosition.x
      this.y = newPosition.y
    }
  }
  
  onDragEnd (event) {
    if (this.draggingEnabled) {
      if (this.canvas) this.canvas.resumeViewport()
      
      this.dragging = false
      this.draggable.alpha = 1
      this.draggable.anchor.set(0)
      
      let newPosition = this.draggingData.getLocalPosition(this.draggable.parent)
      this.x = newPosition.x - this.width / 2
      this.y = newPosition.y - this.height / 2
      
      this.draggingData = null
    }
  }
  
  onDragMove (event) {
    if (this.draggingEnabled && this.dragging) {
      let newPosition = this.draggingData.getLocalPosition(this.draggable.parent)
      this.x = newPosition.x
      this.y = newPosition.y
    }
  }
}
