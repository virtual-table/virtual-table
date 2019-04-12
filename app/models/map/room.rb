class Map::Room < ApplicationRecord
  
  belongs_to :floor
  
  delegate :map, to: :floor,
    allow_nil: true
  
  has_many :walls
  
  has_many :doors
  
end
