class ChatMessageRelayJob < ApplicationJob
  queue_as :default
  
  def perform(message)
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
    
    GameSessionRelayJob.perform_later(game_session, data: ['ChatMessage', [attributes]])
  end
end
