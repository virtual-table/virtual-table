import ObjectController from 'controllers/map/object_controller'
import PIXI from 'lib/pixi'
import Draggable from 'lib/map/draggable'

export default class extends Draggable(ObjectController) {
  
  get floor () {
    return this.room && this.room.floor
  }
  
  get room () {
    return this._room || (this._room = this.findParentController('map--room'))
  }
  
  get origin () {
    return this.data.get('origin').split(',').map((point) => parseFloat(point))
  }
  
  get destination () {
    return this.data.get('destination').split(',').map((point) => parseFloat(point))
  }
  
  connect () {
    if (!this.floor || !this.floor.gameMasterLayer) return
    
    this.wall = this.floor.gameMasterLayer.addChild(new PIXI.Graphics())
    this.draw()
  }
  
  disconnect () {
    this.undraw()
  }
  
  locationUpdated () {
    this.draw()
  }
  
  draw () {
    this.wall.clear()
             .lineStyle(2, 0xFF0000, 1)
             .moveTo(...this.origin)
             .lineTo(...this.destination)
  }
  
  undraw () {
    this.floor.gameMasterLayer.removeChild(this.wall)
  }
}
