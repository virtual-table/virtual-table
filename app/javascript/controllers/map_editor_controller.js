import MapPlayerController from 'controllers/map_player_controller'

require('lib/polyfills/closest')

export default class extends MapPlayerController {
  
  static targets = super.targets
  
  get mode () {
    return this._mode || (this._mode = 'editor')
  }
  
  set mode (v) {
    this._mode = v
  }
  
  get floorLinks () {
    return this.floorTargets.map(
      (floor) => this.element.querySelector(`a[href="#${floor.id}"][data-action*="changeFloor"]`)
    )
  }
  
  connect () {
    super.connect()
    this.mode = 'editor'
  }
  
  // ACTIONS:
  
  changeFloor (event) {
    let link = event.currentTarget.closest('a')
    if (link) {
      event.preventDefault()
      if (link.dataset.floor) {
        this.activeFloor = link.dataset.floor
      } else {
        this.activeFloor = link['href'].split('#').pop()
      }
    }
  }
  
  showActiveFloor() {
    this.floorLinks.forEach(
      (link) => {
        if (link['href'].endsWith(`#${this.activeFloor.id}`)) {
          link.closest('.panel-block').classList.add('is-active')
        } else {
          link.closest('.panel-block').classList.remove('is-active')
        }
      }
    )
    
    super.showActiveFloor()
  }
}
