class Map::Background < ApplicationRecord
  
  has_one_attached :image
  
  delegate :filename, to: :image 
  
  belongs_to :floor
  
  delegate :map, to: :floor
  
end
