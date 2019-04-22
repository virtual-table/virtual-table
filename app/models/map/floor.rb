class Map::Floor < ApplicationRecord
  
  belongs_to :map
  
  has_many :backgrounds,
    dependent: :destroy
  
  has_many :rooms,
    dependent: :destroy
  
  has_many :characters,
    dependent: :destroy
  
  
  
  def width
    columns * grid_size
  end
  
  def height
    rows * grid_size
  end
  
  def grid_size
    50
  end
  
end
