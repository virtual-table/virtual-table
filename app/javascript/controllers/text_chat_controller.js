import ApplicationController from 'controllers/application_controller'
import playerChannel from 'channels/player_channel'
import _ from 'lodash'

export default class extends ApplicationController {
  
  static targets = ['messages', 'input']
  
  addMessage (attributes) {
    let htmlId = `chat_message_${attributes.chat_message_id}`
    if (!document.getElementById(htmlId)) {
      this.messagesTarget.innerHTML += attributes.html
    }
  }
  
}
