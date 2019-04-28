import ObjectController from 'controllers/map/object_controller'
import PIXI from 'lib/pixi'
import Draggable from 'lib/map/draggable'

export default class extends Draggable(ObjectController) {
  
  get floor () {
    return this._floor || (this._floor = this.findParentController('map--floor'))
  }
  
  get path () {
    return JSON.parse(this.data.get('path'))
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
    let line = this.wall.clear().lineStyle(2, 0xFF0000, 1)
    let path = this.path
    
    let point = path.shift()
    line.moveTo(...point)
    
    while (point = path.shift()) {
      line.lineTo(...point)
    }
  }
  
  undraw () {
    this.floor.gameMasterLayer.removeChild(this.wall)
  }
}
