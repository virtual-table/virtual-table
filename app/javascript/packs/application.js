require('channels')

import { Application } from 'stimulus'
import { definitionsFromContext } from 'stimulus/webpack-helpers'
import consumer from '../channels/consumer'

(function() {
  this.VTT || (this.VTT = {})
  
  this.VTT.actionCable = consumer
  
  this.VTT.turboLinks    = require('turbolinks')
  this.VTT.turboLinks.start()
  
  this.VTT.ujs = require('@rails/ujs')
  this.VTT.ujs.start()
  
  this.VTT.trix       = require('trix')
  this.VTT.actionText = require('@rails/actiontext')
  
  this.VTT.activeStorage = require('@rails/activestorage')
  this.VTT.activeStorage.start()
  
  const application = Application.start()
  const context = require.context('../controllers', true, /\.js$/)
  application.load(definitionsFromContext(context))
  
  this.VTT.application = application
  
  Object.defineProperty(this.VTT, 'modal', {
    get: function() {
      let element = document.querySelector('[data-controller*="modal"]')
      return window.VTT.application
                   .getControllerForElementAndIdentifier(element, 'modal')
    }
  })
}).call(window)