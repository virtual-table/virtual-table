class Map::Background < ApplicationRecord
  
  has_one_attached :image
  
  delegate :filename, to: :image,
    allow_nil: true
  
  belongs_to :floor
  
  delegate :map, to: :floor,
    allow_nil: true
  
end
