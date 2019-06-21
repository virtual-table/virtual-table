import ApplicationController from 'controllers/application_controller'
import InspireTree from 'inspire-tree'
import InspireTreeDOM from 'inspire-tree-dom'

export default class extends ApplicationController {
  
  static targets = ['input', 'output']
  
  get mode () { return this.data.get('mode') }
  
  // LIFECYCLE:
  
  connect () {
    this.parseList = this.parseList.bind(this)
    this.parseItem = this.parseItem.bind(this)
    
    this.list = this.parseList(this.inputTarget)
    
    this.tree = new InspireTree({
      data: this.list
    })
    
    alert(this.mode)
    
    this.renderer = new InspireTreeDOM(this.tree, {
      target:      this.outputTarget,
      dragAndDrop: this.mode == 'edit'
    })
    
    this.inputTarget.style.display = 'none'
    
    this.bindEvents()
  }
  
  // DATA:
  
  parseList (list) { 
    const children = list.querySelectorAll(':scope > li')
    return Array.from(children).map(this.parseItem)
  }
  
  parseItem (item) {
    const node = item.querySelector('[data-target="tree.node"]')
    const kids = item.querySelector(':scope > ol, :scope ul')
    
    return {
      text:     node.innerText,
      element:  node,
      children: kids ? this.parseList(kids) : []
    }
  }
  
  // EVENTS:
  
  bindEvents () {
    const tree = this.tree
    tree.on('node.selected', this.nodeSelected.bind(this))
  }
  
  nodeSelected (node) {
    if (node.element) {
      node.element.click()
    }
  }
  
}
