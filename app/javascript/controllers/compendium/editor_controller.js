import ApplicationController from 'controllers/application_controller'
import Rails from '@rails/ujs'

require('lib/polyfills/closest')

const POSITION_PLACEHOLDER    = '__POSITION_PLACEHOLDER__'
const NEW_CONTENT_PLACEHOLDER = '__NEW_CONTENT_PLACEHOLDER__'

export default class extends ApplicationController {
  
  static targets = ['addContentList', 'content']
  
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
  
  moveContent (event) {
    let target = event.currentTarget
    
    if (target) {
      let direction = target.dataset.direction
      let borg      = target.closest('[data-target*="compendium--editor.content"]')
      let victim    = this.contentTargets.find(
        (el, i) => borg == this.contentTargets[direction == 'up' ? i + 1 : i - 1]
      )
      
      if (borg && victim) this.swapElements(borg, victim)
      this.updateContentPositions()
    }
    
    event.preventDefault()
  }
  
  // MUTATIONS:
  
  insertContent (html, link) {
    let addContentList = link.closest('[data-target*="compendium--editor.addContentList"]')
    if (addContentList) {
      html = html.split(NEW_CONTENT_PLACEHOLDER).join(this.contentTargets.length)
      
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
    const lastIndex = this.contentTargets.length - 1
    this.contentTargets.forEach((fieldset, index) => {
      let position = fieldset.querySelector('input[name$="[position]"]')
      let moveUp   = fieldset.querySelector('[data-direction="up"]')
      let moveDown = fieldset.querySelector('[data-direction="down"]')
      
      position.value = index
      moveUp.classList.remove('disabled')
      moveDown.classList.remove('disabled')
      
      if (index == 0) {
        moveUp.classList.add('disabled')
      } else if (index == lastIndex) {
        moveDown.classList.add('disabled')
      }
    })
  }
  
  swapElements (borg, victim) {
    let clone = victim.cloneNode(true)
    borg.parentNode.insertBefore(clone, borg)
    victim.parentNode.insertBefore(borg, victim)
    victim.parentNode.replaceChild(victim, clone)
  }
}
