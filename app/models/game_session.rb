class GameSession < ApplicationRecord
  
  belongs_to :author,
    class_name: 'User'
  
  belongs_to :game
  
  has_many :players,
    foreign_key: 'session_id'
  
  belongs_to :context,
    polymorphic: true,
    optional:    true
  
  belongs_to :map,
    optional: true
  
  validates :subject,
    presence: true
  
end
