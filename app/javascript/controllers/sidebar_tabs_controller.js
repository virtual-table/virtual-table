import { Controller } from 'stimulus'

export default class extends Controller {
  
  static targets = ['tab', 'pane']
  
  get isActiveClass () { return 'is-active' }
  
  connect () {
    this.activateDefaultTab = this.activateDefaultTab.bind(this)
    _.defer(this.activateDefaultTab)
  }
  
  activateDefaultTab () {
    let activeTab = this.tabTargets.find((tab) => tab.classList.contains(this.isActiveClass))
    let firstTab  = this.tabTargets[0]
    
    let defaultTab = activeTab || firstTab
    
    if (defaultTab) {
      this.activateTab(defaultTab)
    }
  }
  
  switchTab (event) {
    let currentTab = event.currentTarget
    
    event.preventDefault()
    this.deactivateAllTabs()
    this.activateTab(currentTab)
  }
  
  activateTab (tab) {
    let paneId = tab.dataset.tabTarget
    tab.classList.add(this.isActiveClass)
    
    let panes = this.paneTargets.filter((pane) => pane.dataset.tabPane == paneId)
    panes.forEach((pane) => pane.classList.add(this.isActiveClass))
  }
  
  deactivateTab (tab) {
    let paneId = tab.dataset.tabTarget
    tab.classList.remove(this.isActiveClass)
    
    let panes = this.paneTargets.filter((pane) => pane.dataset.tabPane == paneId)
    panes.forEach((pane) => pane.classList.remove(this.isActiveClass))
  }
  
  deactivateAllTabs () {
    let activeTabs = this.tabTargets.filter((tab) => tab.classList.contains(this.isActiveClass))
    activeTabs.forEach((tab) => this.deactivateTab(tab))
  }
}
