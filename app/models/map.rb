class Map < ApplicationRecord
  
  belongs_to :page,
    dependent:  :destroy
  
  belongs_to :compendium
  
  has_many :floors,
    -> { order(level: :desc) },
    class_name: 'Map::Floor',
    dependent:  :destroy
  
  has_many :backgrounds,
    through: :floors
  
  has_many :characters,
    through: :floors
  
  has_many :rooms,
    through: :floors
  
  has_many :walls,
    through: :rooms
  
  has_many :doors,
    through: :rooms
  
  def width
    floors.map(&:width).max
  end
  
  def height
    floors.map(&:height).max
  end
  
end
