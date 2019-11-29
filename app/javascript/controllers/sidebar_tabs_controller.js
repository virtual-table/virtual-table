import { Controller } from 'stimulus'

export default class extends Controller {
  
  static targets = ['options', 'tabs']
  
  switchTab () {
    let tab      = event.currentTarget.getAttribute('data-tab')
    let isActive = 'is-active'
    
    event.preventDefault()
    
    this.optionsTarget.getElementsByClassName(isActive)[0].classList.remove(isActive)
    event.currentTarget.classList.add(isActive)
    
    this.tabsTarget.getElementsByClassName(isActive)[0].classList.remove(isActive)
    this.tabsTarget.querySelector('.' + tab).classList.add(isActive)
  }
}
