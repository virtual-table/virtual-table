import ApplicationController from 'controllers/application_controller'
import Rails from '@rails/ujs'

export default class extends ApplicationController {
  
  static targets = ['current']

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
