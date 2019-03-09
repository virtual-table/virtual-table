class Game < ApplicationRecord
  
  has_rich_text :description
  
  belongs_to :author,
    class_name: 'User'
  
end
