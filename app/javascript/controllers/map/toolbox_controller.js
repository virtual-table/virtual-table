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
    
    if (this.editor) {
      console.log('switchMode', mode)
      event.preventDefault()
      event.stopPropagation()
      this.editor.mode = mode
      
      switch (mode) {
        case 'placePoint':
          this.editor.modeCallback = (x, y) => {
            console.log('placePoint', x, y)
            if (target.href) {
              let link = document.createElement('a')
              
              // Use dynamic values in URL:
              link.href = target.href.replace('__X__', x).replace('__Y__', y)
              
              // Copy Rails UJS data-attributes:
              if (link.dataset.confirm)  link.dataset.confirm = target.dataset.confirm
              if (link.dataset.method)   link.dataset.method  = target.dataset.method
              if (target.dataset.remote) link.dataset.remote  = target.dataset.remote
              
              // Click the link:
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          }
          break
          
        default:
          this.editor.modeCallback = null
          break
      }
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
