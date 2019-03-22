import ApplicationController from 'controllers/application_controller'
import _ from 'underscore'

export default class extends ApplicationController {
  
  static targets = ['name', 'width', 'height', 'x', 'y']
  
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
  
  get mapToken () {
    let htmlId  = this.data.get('mapToken')
    let element = document.getElementById(htmlId)
    return this.controllerFor(element, 'map--character')
  }
  
  connect () {
    this.updateToken = _.throttle(
      this.updateToken.bind(this), 50, {
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
  
  updateToken () {
    if (this.mapToken) {
      let token = this.mapToken
      
      token.width  = this.width
      token.height = this.height
      token.x      = this.x
      token.y      = this.y
      
      _.defer(token.sizeUpdated.bind(token))
      _.defer(token.locationUpdated.bind(token))
    }
  }
  
  formChanged (event) {
    this.updateToken()
  }
}
