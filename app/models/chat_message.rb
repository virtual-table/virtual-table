class ChatMessage < ApplicationRecord
  
  belongs_to :session,
    class_name: 'GameSession'
  
  belongs_to :author,
    class_name: 'User',
    optional:   true
  
  after_save :relay_message
  
  def relay_message
    ChatMessageRelayJob.perform_later(self)
  end
  
end
