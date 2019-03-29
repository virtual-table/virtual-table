import _ from 'underscore'
import ApplicationController from 'controllers/application_controller'
import liveCursorChannel from 'channels/live_cursor_channel'

export default class extends ApplicationController {
  
  static targets = ['floor']
  
  get mode ()  { return this._mode }
  set mode (v) { this._mode = v    }
  
  get canvas () {
    return this._canvas || (this._canvas = this.findChildController('map--canvas'))
  }
  
  get viewport () {
    return this.canvas && this.canvas.viewport
  }
  
  get floors () { return (this.canvas && this.canvas.floors) || [] }
  
  get activeFloor () {
    return this.floors.find((floor) => floor.id == this.data.get('activeFloor')) ||
           this.floors[0]
  }
  
  set activeFloor (value) {
    this.data.set('activeFloor', value)
    this.showActiveFloor()
  }
  
  connect () {
    this.mode = 'player'
    
    this.shareCursorPosition = _.throttle(this.shareCursorPosition.bind(this), 100, {
      leading:  false,
      trailing: true
    })
    
    this.showActiveFloor = this.showActiveFloor.bind(this)
    this.trackCursor     = this.trackCursor.bind(this)
    
    _.defer(this.showActiveFloor)
    _.defer(this.trackCursor)
  }
  
  showActiveFloor () {
    let index        = this.floors.indexOf(this.activeFloor)
    let higherFloors = this.floors.slice(0, index).reverse()
    let lowerFloors  = this.floors.slice(index + 1)
    
    for (let [index, floor] of lowerFloors.entries())
      floor.showAtLevel(index)
    
    if (this.activeFloor) this.activeFloor.showAtLevel(lowerFloors.length)
    
    for (let floor of higherFloors) floor.hide()
  }
  
  trackCursor () {
    if (this.viewport) {
      this.canvas.viewport.on('pointermove', this.shareCursorPosition)
    }
  }
  
  shareCursorPosition (event) {
    let data = event.data
    if (data && this.mode == 'player') {
      let gameId = this.data.get('gameId')
      let floor  = this.activeFloor && this.activeFloor.id
      let position = data.getLocalPosition(this.viewport)
      
      liveCursorChannel.sendPosition(gameId, floor, position)
    }
  }
}
