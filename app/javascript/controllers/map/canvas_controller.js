import { Controller } from 'stimulus'

export default class extends Controller {
  connect () {
    this.resize()
  }
  
  resize () {
    let rectangle       = this.element.getBoundingClientRect()
    let windowHeight    = window.innerHeight
    let availableHeight = windowHeight - rectangle.top - 48
    this.element.style.height = `${availableHeight}px`
  }
}
