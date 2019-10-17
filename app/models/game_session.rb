class GameSession < ApplicationRecord
  
  belongs_to :author,
    class_name: 'User'
  
  belongs_to :game
  
  belongs_to :context,
    polymorphic: true,
    optional:    true
  
  belongs_to :map,
    optional: true
  
  validates :subject,
    presence: true
  
end
