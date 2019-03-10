class Map < ApplicationRecord
  
  belongs_to :game
  
  has_many :floors,
    class_name: 'Map::Floor'
  
  has_many :backgrounds,
    through: :floors
  
end
