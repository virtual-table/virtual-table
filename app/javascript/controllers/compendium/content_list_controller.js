import ApplicationController from 'controllers/application_controller'
import Rails from '@rails/ujs'

export default class extends ApplicationController {
  
  showContentList (event) {
    event.preventDefault()
    
    this.element.classList.toggle('is-toggled')
  }
  
  hideContentList (event) {
    event.preventDefault()
    
    this.element.classList.toggle('is-toggled')
  }
}
