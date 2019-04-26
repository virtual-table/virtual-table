import ApplicationController from 'controllers/application_controller'
import Rails from '@rails/ujs'

require('lib/polyfills/closest')

const POSITION_PLACEHOLDER    = '__POSITION_PLACEHOLDER__'
const NEW_CONTENT_PLACEHOLDER = '__NEW_CONTENT_PLACEHOLDER__'

export default class extends ApplicationController {
  
  static targets = ['addContentList']
  
  get contents () {
    return this.findChildControllers('compendium--content')
  }
  
  connect () {
    this.updateAddContentListPositions()
    this.updateContentPositions()
  }
  
  // ACTIONS:
  
  addContent (event) {
    let target = event.currentTarget
    
    if (target) {
      Rails.ajax({
        type:    'GET',
        url:     target['href'],
        success: (html)  => this.insertContent(html, target),
        error:   (error) => document.location.href = target['href']
      })
      
      event.preventDefault()
    }
  }
  
  moveContent (content, direction) {
    let borg   = content
    let victim = this.contents.find(
      (el, i) => {
        let content = this.contents[direction == 'up' ? i + 1 : i - 1]
        return content && content.element && content.element == borg.element
      }
    )
    
    if (borg && victim) this.swapElements(borg.element, victim.element)
    this.updateContentPositions()
  }
  
  trashContent (content) {
    let addContentList = this.addContentListTargets[content.position]
    content.element.style.display = 'none'
    addContentList.style.display = 'none'
  }
  
  // MUTATIONS:
  
  insertContent (html, link) {
    let addContentList = link.closest('[data-target*="compendium--editor.addContentList"]')
    if (addContentList) {
      html = html.split(NEW_CONTENT_PLACEHOLDER).join(this.contents.length)
      
      addContentList.insertAdjacentHTML('afterend', html)
      
      this.updateAddContentListPositions()
      this.updateContentPositions()
    }
  }
  
  updateAddContentListPositions () {
    this.addContentListTargets.forEach((list, position) => {
      let links = list.querySelectorAll(`a[href*="${POSITION_PLACEHOLDER}"], a[data-href-template]`)
      
      for (let link of links) {
        let hrefTemplate
        
        if (link.dataset.hrefTemplate) {
          hrefTemplate = link.dataset.hrefTemplate
        } else {
          hrefTemplate = link.dataset.hrefTemplate = link['href']
        }
        
        link['href'] = hrefTemplate.split(POSITION_PLACEHOLDER).join(position)
      }
    })
  }
  
  updateContentPositions () {
    this.contents.forEach((content, index) => content.position = index)
  }
  
  swapElements (borg, victim) {
    let clone = victim.cloneNode(true)
    borg.parentNode.insertBefore(clone, borg)
    victim.parentNode.insertBefore(borg, victim)
    victim.parentNode.replaceChild(victim, clone)
  }
}
