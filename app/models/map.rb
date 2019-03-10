class Map < ApplicationRecord
  
  belongs_to :game
  
  has_many :floors,
    class_name: 'Map::Floor'
  
  has_many :backgrounds,
    through: :floors
  
  def width
    floors.map(&:width).max
  end
  
  def height
    floors.map(&:height).max
  end
  
end
