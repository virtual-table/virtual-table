class Map::Wall < ApplicationRecord
  
  def origin
    [origin_x, origin_y]
  end
  
  def origin=(v)
    self.origin_x = v.first
    self.origin_y = v.last
  end
  
  def destination
    [destination_x, destination_y]
  end
  
  def destination=(v)
    self.destination_x = v.first
    self.destination_y = v.last
  end
  
end
