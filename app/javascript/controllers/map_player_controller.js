import _ from 'underscore'
import ApplicationController from 'controllers/application_controller'

export default class extends ApplicationController {
  
  static targets = ['floor']
  
  get mode ()  { return this._mode }
  set mode (v) { this._mode = v    }
  
  get canvas () {
    return this._canvas || (this._canvas = this.findChildController('map--canvas'))
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
    _.defer(this.showActiveFloor.bind(this))
  }
  
  showActiveFloor() {
    let index        = this.floors.indexOf(this.activeFloor)
    let higherFloors = this.floors.slice(0, index).reverse()
    let lowerFloors  = this.floors.slice(index + 1)
    
    for (let [index, floor] of lowerFloors.entries())
      floor.showAtLevel(index)
    
    if (this.activeFloor) this.activeFloor.showAtLevel(lowerFloors.length)
    
    for (let floor of higherFloors) floor.hide()
  }
}
