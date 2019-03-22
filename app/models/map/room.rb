class Map::Room < ApplicationRecord
  
  has_rich_text :description
  
  belongs_to :floor
  
  delegate :map, to: :floor
  
  has_many :walls
  
  has_many :doors
  
end
