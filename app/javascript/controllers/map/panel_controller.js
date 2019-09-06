import ApplicationController from 'controllers/application_controller'

export default class extends ApplicationController {
  
  static targets = ['tab']
  
  get active () {
    return this.data.get('active') == 'true'
  }
  
  set active (value) {
    this.data.set('active', value ? 'true' : 'false')
  }
  
  get tabs () {
    return this.tabTargets
  }
  
  get tabLinks () {
    return this.tabs.map(
      (tab) => this.element.querySelector(`a[href="#${tab.id}"][data-action*="changeTab"]`)
    )
  }
  
  get activeTab () {
    return this.data.get('activeTab')
  }
  
  set activeTab (value) {
    this.data.set('activeTab', value)
    this.showActiveTab()
  }
  
  connect () {
    if (this.tabs.length) {
      this.activeTab || (this.activeTab = this.tabs[0].id)
      this.showActiveTab()
    }
    
    if (!this.active) {
      this.hide()
    } else {
      this.show()
    }
  }
  
  // ACTIONS:
  
  hide () {
    this.element.style.display = 'none'
  }
  
  show () {
    this.findControllers('map--panel').forEach((panel) => panel.hide())
    this.element.style.display = 'block'
  }
  
  openPanel (event) {
    let link = event.currentTarget.closest('a')
    if (link) {
      event.preventDefault()
      
      let panel = this.getPanel(
        link.dataset.panel     ?
            link.dataset.panel :
            link['href'].split('#').pop()
      )
      
      if (panel) {
        panel.show()
      }
    }
  }
  
  changeTab (event) {
    let link = event.currentTarget.closest('a')
    if (link) {
      event.preventDefault()
      if (link.dataset.tab) {
        this.activeTab = link.dataset.tab
      } else {
        this.activeTab = link['href'].split('#').pop()
      }
    }
  }
  
  showActiveTab () {
    this.tabLinks.forEach(
      (link) => {
        if (link['href'].endsWith(`#${this.activeTab}`)) {
          link.classList.add('is-active')
        } else {
          link.classList.remove('is-active')
        }
      }
    )
    
    this.tabs.forEach(
      (tab) => {
        if (tab.id == this.activeTab) {
          tab.style.display = 'block'
        } else {
          tab.style.display = 'none'
        }
      }
    )
  }
  
  // HELPERS:
  
  getPanel (htmlId) {
    let element = document.getElementById(htmlId)
    if (element) {
      return this.application.getControllerForElementAndIdentifier(
        element, 'map--panel'
      )
    }
  }
}
