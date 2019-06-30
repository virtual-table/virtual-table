import ApplicationController from 'controllers/application_controller'
import _ from 'lodash'

export default class extends ApplicationController {
  
  static targets = [
    'hideButton', 'showButton',
    'moveUpButton', 'moveDownButton',
    'deleteField', 'positionField', 'visibleField'
  ]
  
  // ATTRIBUTES:
  
  get editor   () { return this.findParentController('compendium--editor') }
  get siblings () { return this.editor.contents }
  
  get position () {
    return parseInt(this.positionFieldTarget.value)
  }
  
  set position (newPosition) {
    this.positionFieldTarget.value = newPosition
    this.positionChanged()
  }
  
  get visible () {
    return this.visibleFieldTarget.value == 'true'
  }
  
  set visible (newVisible) {
    this.visibleFieldTarget.value = newVisible.toString()
    this.visibleChanged()
  }
  
  // LIFECYCLE:
  
  connect () {
    _.defer(() => {
      this.positionChanged()
      this.visibleChanged()
    })
  }
  
  // ACTIONS:
  
  delete (event) {
    this.deleteFieldTarget.value = 'true'
    this.editor.trashContent(this)
    
    event.preventDefault()
  }
  
  moveUp (event) {
    this.editor.moveContent(this, 'up')
    
    event.preventDefault()
  }
  
  moveDown (event) {
    this.editor.moveContent(this, 'down')
    
    event.preventDefault()
  }
  
  show (event) {
    this.visible = true
    
    event.preventDefault()
  }
  
  hide (event) {
    this.visible = false
    
    event.preventDefault()
  }
  
  // EVENTS:
  
  positionChanged () {
    this.moveUpButtonTarget.classList.remove('disabled')
    this.moveDownButtonTarget.classList.remove('disabled')
    
    let newPosition  = this.position
    let lastPosition = this.siblings.length - 1
    
    if (newPosition == 0) {
      this.moveUpButtonTarget.classList.add('disabled')
    } else if (newPosition == lastPosition) {
      this.moveDownButtonTarget.classList.add('disabled')
    }
  }
  
  visibleChanged () {
    this.showButtonTarget.classList.remove('disabled')
    this.hideButtonTarget.classList.remove('disabled')
    
    if (this.visible) {
      this.showButtonTarget.classList.add('disabled')
    } else {
      this.hideButtonTarget.classList.add('disabled')
    }
  }
  
}
