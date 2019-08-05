import _ from 'lodash'
import ApplicationController from 'controllers/application_controller'

export default class extends ApplicationController {
  
  static targets = ['current', 'option']
  
  connect () {
    this.showInitialSelection = this.showInitialSelection.bind(this)
    _.defer(this.showInitialSelection)
  }
  
  showInitialSelection () {
    if (this.hasOptionTarget && this.optionTargets.length) {
      let activeOption = this.optionTargets.find((el) => el.classList.contains('faux-select-active'))
      if (!activeOption) activeOption = this.optionTargets[0]
      
      this.currentTarget.innerHTML = activeOption.textContent
    }
  }
  
  toggleOptions (event) {
    event.preventDefault()
    this.element.classList.toggle('is-active')
  }
  
  hideOptions (event) {
    if (!this.element.contains(event.target)) {
      this.element.classList.remove('is-active')
    }
  }
  
  selectOption (event) {
    event.preventDefault()
    
    this.currentTarget.innerHTML = event.currentTarget.textContent
    this.element.classList.toggle('is-active')
  }
}
