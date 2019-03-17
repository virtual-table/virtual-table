import { Controller } from 'stimulus'
import _ from 'underscore'

export default class extends Controller {
  findParentController (identifier) {
    return this.application
               .getControllerForElementAndIdentifier(
                 this.element.closest(`[data-controller*="${identifier}"]`),
                 identifier
               )
  } 
  
  findChildController (identifier) {
    let element = this.element.querySelector(`[data-controller*="${identifier}"]`)
    if (element) {
      return this.application.getControllerForElementAndIdentifier(element, identifier)
    }
  }
  
  findChildControllers (identifier) {
    return _.compact(
      [
        ...this.element.querySelectorAll(`[data-controller*="${identifier}"]`)
      ].map(
        (element) => this.application.getControllerForElementAndIdentifier(element, identifier)
      )
    )
  }
}
