import _ from 'underscore'
import ApplicationController from 'controllers/application_controller'

require('lib/polyfills/closest')

export default class extends ApplicationController {
  
  static targets = ['floor']
  
  get canvas () {
    return this._canvas || (this._canvas = this.findChildController('map--canvas'))
  }
  
  get floors () { return (this.canvas && this.canvas.floors) || [] }
  
  get floorLinks () {
    return this.floorTargets.map(
      (floor) => this.element.querySelector(`a[href="#${floor.id}"][data-action*="changeFloor"]`)
    )
  }
  
  get activeFloor () {
    return this.floors.find((floor) => floor.id == this.data.get('activeFloor')) ||
           this.floors[0]
  }
  
  set activeFloor (value) {
    this.data.set('activeFloor', value)
    this.showActiveFloor()
  }
  
  connect () {
    _.defer(this.showActiveFloor.bind(this))
  }
  
  // ACTIONS:
  
  showActiveFloor() {
    this.floorLinks.forEach(
      (link) => {
        if (link['href'].endsWith(`#${this.activeFloor.id}`)) {
          link.closest('.panel-block').classList.add('is-active')
        } else {
          link.closest('.panel-block').classList.remove('is-active')
        }
      }
    )
    
    let index = this.floors.indexOf(this.activeFloor)
    let higherFloors  = this.floors.slice(0, index).reverse()
    let lowerFloors   = this.floors.slice(index + 1)
    
    for (let [index, floor] of lowerFloors.entries())
      floor.showAtLevel(index)
    
    if (this.activeFloor) this.activeFloor.showAtLevel(lowerFloors.length)
    
    for (let floor of higherFloors) floor.hide()
  }
  
  changeFloor (event) {
    let link = event.currentTarget.closest('a')
    if (link) {
      event.preventDefault()
      if (link.dataset.floor) {
        this.activeFloor = link.dataset.floor
      } else {
        this.activeFloor = link['href'].split('#').pop()
      }
    }
  }
  
  zoomIn () {
    if (this.canvas) this.canvas.viewport.zoomPercent(0.25, true)
  }
  
  zoomOut () {
    if (this.canvas) this.canvas.viewport.zoomPercent(-0.25, true)
  }
}
