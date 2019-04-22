class Page::FloorPage < ::Page
  
  has_one :floor,
    class_name:  'Map::Floor',
    foreign_key: 'page_id',
    dependent:   :destroy
  
end