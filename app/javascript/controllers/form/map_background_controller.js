import ApplicationController from 'controllers/application_controller'
import _ from 'underscore'

export default class extends ApplicationController {
  
  static targets = ['width', 'height', 'x', 'y']
  
  get width ()  { return parseFloat(this.widthTarget.value) }
  set width (v) { this.widthTarget.value = v    }
  
  get height ()  { return parseFloat(this.heightTarget.value) }
  set height (v) { this.heightTarget.value = v    }
  
  get x ()  { return parseFloat(this.xTarget.value) }
  set x (v) { this.xTarget.value = v    }
  
  get y ()  { return parseFloat(this.yTarget.value) }
  set y (v) { this.yTarget.value = v    }
  
  get panel () {
    return this.findParentController('map--panel')
  }
  
  get mapBackground () {
    let htmlId  = this.data.get('mapBackground')
    let element = document.getElementById(htmlId)
    return this.controllerFor(element, 'map--background')
  }
  
  connect () {
    this.updateBackground = _.throttle(
      this.updateBackground.bind(this), 50, {
      leading:  false,
      trailing: true
    })
  }
  
  show () {
    if (this.panel) {
      this.findControllers('map--panel').forEach((p) => p.hide())
      this.panel.show()
    }
  }
  
  updateBackground () {
    if (this.mapBackground) {
      let background = this.mapBackground
      
      background.width  = this.width
      background.height = this.height
      background.x      = this.x
      background.y      = this.y
      
      _.defer(background.sizeUpdated.bind(background))
      _.defer(background.locationUpdated.bind(background))
    }
  }
  
  formChanged (event) {
    this.updateBackground()
  }
}
