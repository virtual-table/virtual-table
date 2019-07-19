import { Controller } from 'stimulus'
import _ from 'lodash'

export default class extends Controller {
  
  connect () {
    _.defer(this.showInitialPanel.bind(this))
  }
  
  // ACTIONS:
  
  showInitialPanel () {
    let initialPanel = this.data.get('initialPanel')
    
    if (initialPanel) {
      let panel = this.getPanel(initialPanel)
      if (panel) this.showPanel(panel)
    }
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
      
      if (panel) this.showPanel(panel)
    }
  }
  
  showPanel (panel) {
    if (this.activePanel) this.activePanel.hide()
    this.activePanel = panel
    
    panel.show()
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
