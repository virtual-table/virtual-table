class Map::AreaPage < ApplicationRecord
  
  belongs_to :area,
    class_name: 'Map::Area'
  
  belongs_to :page
  
end
