class Map::Room < ApplicationRecord
  
  belongs_to :floor
  
  delegate :map, to: :floor,
    allow_nil: true
  
  has_many :walls,
    dependent: :destroy
  
  has_many :doors,
    dependent: :destroy
  
  
end
