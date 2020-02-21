import AccordionController from 'controllers/accordion_controller'
import _ from 'lodash'

export default class extends AccordionController {
  
  get editor () { return this.findParentController('map-editor') }
  
  connect () {
    super.connect()
  }
  
  // ACTIONS:
  
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
}
