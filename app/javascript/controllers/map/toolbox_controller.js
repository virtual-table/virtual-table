import ApplicationController from 'controllers/application_controller'
import _ from 'lodash'

export default class extends ApplicationController {
  
  get editor () { return this.findParentController('map-editor') }
  
  connect () {
    _.defer(this.showInitialPanel.bind(this))
  }
  
  // ACTIONS:
  
  showInitialPanel () {
    let initialPanel = this.data.get('initialPanel')
    
    if (initialPanel) {
      let panel = this.getPanel(initialPanel)
      if (panel) panel.show()
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
      
      if (panel) panel.show()
    }
  }
  
  switchMode (event) {
    let target = event.currentTarget
    let mode   = target.dataset['map-ToolboxMode']
    let link   = target['href']
    
    if (this.editor) {
      event.preventDefault()
      this.editor.mode = mode
    }
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
