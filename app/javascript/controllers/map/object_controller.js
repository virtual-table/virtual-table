import ApplicationController from 'controllers/application_controller'

export default class extends ApplicationController {
  get x ()  { return parseInt(this.data.get('x')) }
  set x (v) {
    this.data.set('x', v)
    this.locationUpdated()
  }
  
  get y ()  { return parseInt(this.data.get('y')) }
  set y (v) {
    this.data.set('y', v)
    this.locationUpdated()
  }
  
  get center () {
    return [
      this.x + this.width  / 2,
      this.y + this.height / 2
    ]
  }
  
  get width ()  { return parseInt(this.data.get('width')) }
  set width (v) {
    this.data.set('width', v)
    this.sizeUpdated()
  }
  
  get height ()  { return parseInt(this.data.get('height')) }
  set height (v) {
    this.data.set('height', v)
    this.sizeUpdated()
  }
  
  sizeUpdated() {
    
  }
  
  locationUpdated () {
    
  }
}
