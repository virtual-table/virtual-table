import ObjectController from 'controllers/map/object_controller'
import PIXI from 'lib/pixi'
import _ from 'underscore'

export default class extends ObjectController {
  
  get label ()  { return this.data.get('label') }
  set label (v) { this.data.set('label', v)     }
  
  get visible ()  { return this.data.get('visible') == 'true'      }
  set visible (v) { this.data.set('visible', v ? 'true' : 'false') }
  
  get canvas () {
    return this._canvas || (this._canvas = this.findParentController('map--canvas'))
  }
  
  get viewport () {
    return this.canvas.viewport
  }
  
  connect () {
    _.defer(this.addCursor.bind(this))
  }
  
  addCursor () {
    let container = this.container = this.viewport.addChild(new PIXI.Container())
    container.x = this.x
    container.y = this.y
    container.visible = this.visible
    
    let cursor = this.cursor = container.addChild(new PIXI.Graphics())
    cursor.beginFill(0x000000)
          .lineStyle(1, 0xFFFFFF, 1)
          .drawPolygon(
             0,  1,
             0, 20,
             4, 16,
             7, 24,
            10, 22,
             7, 14,
            14, 14,
             0,  1
          )
    
    let label = this.cursorLabel = container.addChild(new PIXI.Text(this.label, {
      fontFamily: 'Arial',
      fontSize:   12,
      fill:       0x000000
    }))
    label.x = 7
    label.y = 28
  }
  
  updatePosition () {
    let container = this.container
    container.x = this.x
    container.y = this.y
    
    container.visible = this.visible
  }
}
