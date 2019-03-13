import _ from 'underscore'
import { Controller } from 'stimulus'

require('lib/polyfills/closest')

export default class extends Controller {
  
  static targets = ['panel']
  
  get canvas () {
    return this._canvas || (
      this._canvas =
        this.application
            .getControllerForElementAndIdentifier(
              this.element.querySelector('[data-controller*="map--canvas"]'),
              'map--canvas'
            )
    )
  }
  
  get floors () { return this.canvas.floors }
  
  get panelLinks () {
    return this.panelTargets.map(
      (panel) => this.element.querySelector(`a[href="#${panel.id}"][data-action*="changePanel"]`)
    )
  }
  
  get panels () {
    return this.panelTargets
  }
  
  get activePanel () {
    return this.data.get('activePanel')
  }
  
  set activePanel (value) {
    console.log('activePanel = ', value)
    this.data.set('activePanel', value)
    this.showActivePanel()
  }
  
  get activeFloor () {
    return this.floors.find((floor) => floor.id == this.data.get('activeFloor'))
  }
  
  set activeFloor (value) {
    this.data.set('activeFloor', value)
    this.activateFloor()
    this.showActivePanel()
  }
  
  connect () {
    this.showActivePanel()
    
    _.defer(this.activateFloor.bind(this))
  }
  
  // ACTIONS:
  
  showActivePanel () {
    this.panelLinks.forEach(
      (link) => {
        if (link['href'].endsWith(`#${this.activePanel}`)) {
          link.classList.add('is-active')
        } else {
          link.classList.remove('is-active')
        }
      }
    )
    
    this.panels.forEach(
      (panel) => {
        if (panel.id == this.activePanel) {
          panel.style.display = 'block'
        } else {
          panel.style.display = 'none'
        }
      }
    )
  }
  
  changePanel (event) {
    let link = event.currentTarget.closest('a')
    if (link) {
      event.preventDefault()
      this.activePanel = link['href'].split('#').pop()
    }
  }
  
  zoomIn () {
    if (this.canvas) this.canvas.viewport.zoomPercent(0.25, true)
  }
  
  zoomOut () {
    if (this.canvas) this.canvas.viewport.zoomPercent(-0.25, true)
  }
  
  activateFloor () {
    this.floors.forEach((floor) => floor.active = false)
    if (this.activeFloor) this.activeFloor.active = true
  }
}
