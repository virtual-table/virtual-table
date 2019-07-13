import { Controller } from 'stimulus'
import _ from 'lodash'

export default class extends Controller {
  findParentController (identifier) {
    return this.controllerFor(this.element.closest(`[data-controller*="${identifier}"]`), identifier)
  } 
  
  findChildController (identifier) {
    let element = this.element.querySelector(`[data-controller*="${identifier}"]`)
    if (element) {
      return this.controllerFor(element, identifier)
    }
  }
  
  findChildControllers (identifier) {
    return _.compact(
      [
        ...this.element.querySelectorAll(`[data-controller*="${identifier}"]`)
      ].map(
        (element) => this.controllerFor(element, identifier)
      )
    )
  }
  
  findControllers (identifier) {
    return _.compact(
      [
        ...document.querySelectorAll(`[data-controller*="${identifier}"]`)
      ].map(
        (element) => this.controllerFor(element, identifier)
      )
    )
  }
  
  controllerFor(element, identifier) {
    return this.application.getControllerForElementAndIdentifier(element, identifier)
  }
}
