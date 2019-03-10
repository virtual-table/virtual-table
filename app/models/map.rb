class Map < ApplicationRecord
  
  belongs_to :game
  
  has_many :floors,
    class_name: 'Map::Floor'
  
end
