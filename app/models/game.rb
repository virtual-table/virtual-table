class Game < ApplicationRecord
  
  has_rich_text :description
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :players
  
  has_many :users, 
    through: :players
  
end
