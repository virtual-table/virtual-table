import WallController from 'controllers/map/wall_controller'
import PIXI from 'lib/pixi'
import Rails from '@rails/ujs'

export default class extends WallController {
  
  get closed ()  { return this.data.get('closed') == 'true'      }
  set closed (v) { this.data.set('closed', v ? 'true' : 'false') }
  
  connect () {
    if (!this.floor || !this.floor.gameMasterLayer) return
    super.connect()
    
    this.wall.interactive = true
    this.wall.on('pointerdown', this.toggleDoor.bind(this))
  }
  
  draw () {
    let color = this.closed ? 0xFFAA00 : 0x00FF00
    let origin = this.origin
    let destination = this.destination
    let width = this.destination[0] - this.origin[0]
    let height = this.destination[1] - this.origin[1]
    
    this.wall.hitArea = new PIXI.Rectangle(
      this.origin[0] - 5, this.origin[1] -5,
      width + 10, height + 10
    )
    
    this.wall.clear()
             .lineStyle(4, color, 1)
             .moveTo(...this.origin)
             .lineTo(...this.destination)
  }
  
  toggleDoor () {
    this.closed = !this.closed
    this.save()
    
    this.draw()
    this.floor.updateObstacles()
  }
  
  save () {
    if (this.data.has('url')) {
      let body    = {
        _method: 'PUT',
        map_door: {
          closed: this.closed
        }
      }
      
      let request = new Request(
        this.data.get('url'), {
        method: 'PUT',
        body:   JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': Rails.csrfToken()
        }
      })
      
      fetch(request)
    }
  }
}
