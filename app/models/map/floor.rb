class Map::Floor < ApplicationRecord
  
  belongs_to :map
  
  has_many :backgrounds
  
end
