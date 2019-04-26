import ApplicationController from 'controllers/application_controller'

export default class extends ApplicationController {
  
  static targets = ['positionField']
  
  get editor   () { return this.findParentController('compendium--editor') }
  get siblings () { return this.editor.contents }
  
  get position () {
    return parseInt(this.positionFieldTarget.value)
  }
  
  set position (newPosition) {
    this.positionFieldTarget.value = newPosition
    
    let moveUp   = this.element.querySelector('[data-action*="compendium--content#moveUp"]')
    let moveDown = this.element.querySelector('[data-action*="compendium--content#moveDown"]')
    
    moveUp.classList.remove('disabled')
    moveDown.classList.remove('disabled')
    
    let lastPosition = this.siblings.length - 1
    if (newPosition == 0) {
      moveUp.classList.add('disabled')
    } else if (newPosition == lastPosition) {
      moveDown.classList.add('disabled')
    }
  }
  
  moveUp (event) {
    this.editor.moveContent(this, 'up')
    event.preventDefault()
  }
  
  moveDown (event) {
    this.editor.moveContent(this, 'down')
    event.preventDefault()
  }
  
}
