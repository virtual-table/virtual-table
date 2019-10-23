class ChatMessage < ApplicationRecord
  
  belongs_to :session,
    class_name: 'GameSession'
  
  belongs_to :author,
    class_name: 'User',
    optional:   true
  
end
