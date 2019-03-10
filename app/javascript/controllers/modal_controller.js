import { Controller } from 'stimulus'

require('lib/polyfills/closest')

const ESC_KEYCODE   = 27
const LEFT_KEYCODE  = 37
const RIGHT_KEYCODE = 39

var focusedElementBeforeDialogOpened;

export default class extends Controller {
  
  static targets = [ 'container', 'modal', 'close', 'content' ]
  
  connect () {
    this.body     = this.element
    this.opened   = false
    this.opener   = null
    this.siblings = []
    this.index    = 0
    
    if (!this.hasModalTarget) {
      this.body.innerHTML += `
        <div class="modal" role="dialog" aria-modal="true" tabindex="-1" 
             data-target="modal.modal"
             data-action="keydown@window->modal#handleKeyEvent">
          
          <div class="modal-background"
               data-action="click->modal#close">
          </div>
          
          <div data-target="modal.content" id="modal_content">
          </div>
          
          <button class="modal-close is-large" aria-label="close"
                  data-target="modal.close"
                  data-action="click->modal#close"></button>
        </div>
      `
    }
  }
  
  handleKeyEvent (event) {
    if (this.opened) {
      switch (event.keyCode) {
        case ESC_KEYCODE:
          this.close()
          break
        
        case LEFT_KEYCODE:
          this.previous()
          break
        
        case RIGHT_KEYCODE:
          this.next()
          break
      }
    }
  }
  
  get index () { return parseInt(this.data.get('index')) }
  set index (value) {
    if (parseInt(this.data.get('index')) != value) {
      this.data.set('index', value)
      let newOpener = this.siblings[value]
      
      if (newOpener) {
        newOpener.click()
      }
    }
  }
  
  get siblings () { return this._siblings }
  set siblings (array) {
    this._siblings = array
    
    if (array.length >= 1)
      this.index = array.indexOf(this.opener)
    else
      this.index = 0 
  }
  
  previous () {
    if (this.siblings.length > 1) {
      if (this.index == 0)
        this.index = this.siblings.length - 1
      else
        this.index--
    }
  }
  
  next () {
    if (this.siblings.length > 1) {
      if (this.index < (this.siblings.length - 1))
        this.index++
      else
        this.index = 0
    }
  }
  
  show (html) {
    this.contentTarget.innerHTML = html
    if (!this.opened) this.open()
  }
  
  open (event) {
    this.modalTarget.classList.add('is-active')
    this.containerTarget.setAttribute('aria-hidden', 'true')
    
    focusedElementBeforeDialogOpened = document.activeElement
    
    this.closeTarget.focus()
        
    this.opened = true
        
    if (event) {
      event.preventDefault()
      this.opener = event.currentTarget
    } else {
      this.opener = null
    }
    
    if (this.opener) {
      let gallery  = this.opener.closest('[itemtype="http://schema.org/ImageGallery"]')
      if (gallery) {
        this.siblings = gallery.querySelectorAll('a[data-action="modal#open"]')
      } else {
        this.siblings = [this.opener]
      }
    }
  }
  
  close (event) {
    this.modalTarget.classList.remove('is-active')
    this.containerTarget.removeAttribute('aria-hidden')
    
    if (focusedElementBeforeDialogOpened) {
      focusedElementBeforeDialogOpened.focus()
    }
    
    this.opened   = false
    this.opener   = null
    this.siblings = []
    this.contentTarget.innerHTML = ''
  }
}
