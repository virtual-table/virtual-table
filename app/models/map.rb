class Map < ApplicationRecord
  
  belongs_to :game
  
  has_many :floors,
    -> { order(level: :asc) },
    class_name: 'Map::Floor'
  
  has_many :backgrounds,
    through: :floors
  
  has_many :characters,
    through: :floors
  
  def width
    floors.map(&:width).max
  end
  
  def height
    floors.map(&:height).max
  end
  
end
