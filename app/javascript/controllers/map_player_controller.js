import _ from 'underscore'
import ApplicationController from 'controllers/application_controller'
import playerChannel from 'channels/player_channel'

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
    this.mode = this.data.get('playerRole') || 'player'
    
    this.channel = playerChannel
    this.channel.playerId = parseInt(this.data.get('playerId'))
    
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
      this.shareCursorPosition = _.throttle(this.shareCursorPosition.bind(this), this.channel.broadcastRate)
      this.canvas.viewport.on('pointermove', this.shareCursorPosition)
    }
  }
  
  shareCursorPosition (event) {
    let data = event.data
    let position = data.getLocalPosition(this.viewport)
    this.channel.sendCursorPosition(position.x, position.y)
  }
}
