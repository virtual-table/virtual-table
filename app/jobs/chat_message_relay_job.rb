class ChatMessageRelayJob < ApplicationJob
  queue_as :default
  
  def self.attributes_for(message)
    game_session = message.session
    message_html = ApplicationController.render(
      partial: 'games/chat_messages/chat_message',
      locals: {
        chat_message: message
      }
    )
    
    attributes = {
      game_session_id: game_session.id,
      chat_message_id: message.id,
      html:            message_html
    }
  end
  
  def perform(message)
    attributes = self.class.attributes_for(message)
    GameSessionRelayJob.perform_later(message.session, data: ['ChatMessage', [attributes]])
  end
end
