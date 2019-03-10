class Map::Floor < ApplicationRecord
  
  belongs_to :map
  
  has_many :backgrounds
  
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
