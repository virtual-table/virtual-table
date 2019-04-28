import ApplicationController from 'controllers/application_controller'
import _ from 'underscore'
import PIXI from 'lib/pixi'

export default class extends ApplicationController {
  
  get floor () {
    return this._floor || (this._floor = this.findParentController('map--floor'))
  }
  
  get walls () {
    return this.findChildControllers('map--wall')
  }
  
  get doors () {
    return this.findChildControllers('map--door')
  }
  
  get closedDoors () {
    return this.doors.filter((door) => door.closed)
  }
  get bounds () { return JSON.parse(this.data.get('bounds')) }
  
  get center () {
    let points = this.bounds
    
    let xPoints = points.map((point) => point[0])
    let yPoints = points.map((point) => point[1])
    
    let xSum = 0
    let ySum = 0
    
    for (let i = 0; i < xPoints.length; i++) {
      xSum += xPoints[i]
      ySum += yPoints[i]
    }
    
    return [
      xSum / xPoints.length,
      ySum / yPoints.length
    ]
  }
  
  get obstacles () {
    let walls = this.walls.map((wall) => new PIXI.Polygon(wall.path))
    let doors = this.closedDoors.map((door) => new PIXI.Polygon([door.origin, door.destination]))
    
    return walls.concat(doors)
  }
  
  get shortCode () {
    return this.data.get('shortCode')
  }
  
  connect () {
    if (!this.floor || !this.floor.gameMasterLayer) return
    
    if (this.shortCode) {
      this.token = this.floor.gameMasterLayer.addChild(new PIXI.Container())
      this.frame = this.token.addChild(new PIXI.Graphics())
      this.label = this.token.addChild(new PIXI.Text(this.shortCode, {
        fontFamily: 'Arial',
        fontSize:   32,
        fill:       0xFFFFFF
      }))
      
      _.defer(this.draw.bind(this))
    }
  }
  
  disconnect () {
    this.undraw()
  }
  
  locationUpdated () {
    
  }
  
  draw () {
    let center = this.center
    
    this.token.x = center[0]
    this.token.y = center[1]
    
    this.label.x = 0 - (this.label.width  / 2)
    this.label.y = 0 - (this.label.height / 2)
    this.frame.clear().beginFill(0xFFFF00, 0.5).drawCircle(0, 0, 25)
  }
  
  undraw () {
    
  }
}
