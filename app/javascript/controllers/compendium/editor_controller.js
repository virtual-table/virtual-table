import ApplicationController from 'controllers/application_controller'

require('lib/polyfills/closest')

export default class extends ApplicationController {
  
  static targets = ['content']
  
  connect () {
    this.updateContentPositions()
  }
  
  moveContent (event) {
    let target = event.currentTarget
    
    if (target) {
      let direction = target.dataset.direction
      let borg      = target.closest('[data-target*="compendium--editor.content"]')
      let victim    = this.contentTargets.find(
        (el, i) => borg == this.contentTargets[direction == 'up' ? i + 1 : i - 1]
      )
      
      if (borg && victim) this.swapElements(borg, victim)
      this.updateContentPositions()
    }
    
    event.preventDefault()
  }
  
  updateContentPositions () {
    const lastIndex = this.contentTargets.length - 1
    this.contentTargets.forEach((fieldset, index) => {
      let position = fieldset.querySelector('input[name$="[position]"]')
      let moveUp   = fieldset.querySelector('[data-direction="up"]')
      let moveDown = fieldset.querySelector('[data-direction="down"]')
      
      position.value = index
      moveUp.classList.remove('disabled')
      moveDown.classList.remove('disabled')
      
      if (index == 0) {
        moveUp.classList.add('disabled')
      } else if (index == lastIndex) {
        moveDown.classList.add('disabled')
      }
    })
  }
  
  swapElements (borg, victim) {
    let clone = victim.cloneNode(true)
    borg.parentNode.insertBefore(clone, borg)
    victim.parentNode.insertBefore(borg, victim)
    victim.parentNode.replaceChild(victim, clone)
  }
}
