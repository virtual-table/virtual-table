class GameSession < ApplicationRecord
  
  belongs_to :author,
    class_name: 'User'
  
  belongs_to :game
  
  has_many :players,
    foreign_key: 'session_id'
  
  has_many :chat_messages,
    foreign_key: 'session_id'
  
  belongs_to :current_context,
    polymorphic: true,
    optional:    true
  
  belongs_to :current_map,
    class_name: 'Map',
    optional: true
  
  validates :subject,
    presence: true
  
end
