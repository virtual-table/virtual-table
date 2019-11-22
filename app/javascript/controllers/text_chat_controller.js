import ApplicationController from 'controllers/application_controller'
import playerChannel from 'channels/player_channel'
import _ from 'lodash'

export default class extends ApplicationController {
  
  static targets = ['messages', 'input']
  
  connect () {
    this.scrollToBottom = this.scrollToBottom.bind(this)
    
    _.defer(this.scrollToBottom)
  }
  
  addMessage (attributes) {
    if (this.hasMessagesTarget) {
      let htmlId = `chat_message_${attributes.chat_message_id}`
      
      if (!document.getElementById(htmlId)) {
        this.messagesTarget.innerHTML += attributes.html
        this.scrollToBottom()
      }
    }
  }
  
  scrollToBottom () {
    if (this.hasMessagesTarget) {
      let container = this.messagesTarget
      container.scrollTop = container.scrollHeight
    }
  }
}
