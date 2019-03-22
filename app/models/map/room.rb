class Map::Room < ApplicationRecord
  
  has_rich_text :description
  
  belongs_to :floor
  
  delegate :map, to: :floor,
    allow_nil: true
  
  has_many :walls
  
  has_many :doors
  
end
