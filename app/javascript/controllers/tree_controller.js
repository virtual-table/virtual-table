import ApplicationController from 'controllers/application_controller'
import InspireTree from 'inspire-tree'
import InspireTreeDOM from 'inspire-tree-dom'
import Rails from '@rails/ujs'
import _ from 'lodash'

export default class extends ApplicationController {
  
  static targets = ['input', 'output']
  
  get mode () { return this.data.get('mode') }
  
  get updateURL ()    { return this.data.get('update-url')             }
  get updateMethod () { return this.data.get('update-method') || 'PUT' }
  
  // LIFECYCLE:
  
  connect () {
    this.parseList = this.parseList.bind(this)
    this.parseItem = this.parseItem.bind(this)
    
    this.list = this.parseList(this.inputTarget)
    
    this.tree = new InspireTree({
      data: this.list
    })
    
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
  
  serializeList (list) {
    return list.map((item) => {
      return {
        text:     item.text,
        id:       item.id,
        children: item.children ? this.serializeList(item.children) : []
      }
    })
  }
  
  parseItem (item) {
    const node = item.querySelector('[data-target="tree.node"]')
    const kids = item.querySelector(':scope > ol, :scope ul')
    
    const selected = node.classList.contains('selected') 
    const expanded = item.querySelectorAll('.selected[data-target="tree.node"]').length >= 1
    
    return {
      text:     node.innerText,
      id:       node.dataset.treeId,
      element:  node,
      classList: node.classList,
      itree:    {
        state: { 
          selected:  selected,
          collapsed: !(selected || expanded)
        },
      },
      children: kids ? this.parseList(kids) : [],
    }
  }
  
  // EVENTS:
  
  bindEvents () {
    const tree = this.tree
    tree.on('node.selected', this.nodeSelected.bind(this))
    tree.on('node.drop',     this.nodeDrop.bind(this))
  }
  
  nodeSelected (node) {
    if (node.element) {
      node.element.click()
    }
  }
  
  nodeDrop (event, source, target, index) {
    const nodes = this.tree.nodes()
    const data  = this.serializeList(nodes)
    
    if (this.updateURL) {
      let body    = _.merge({ _method: this.updateMethod }, { pages: data })
      let request = new Request(
        this.updateURL, {
        method: this.updateMethod,
        body:   JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': Rails.csrfToken()
        }
      })
      
      fetch(request)
    }
  }
  
}
