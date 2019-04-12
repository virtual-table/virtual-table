class Page::RoomPage < ::Page
  
  has_one :room,
    class_name:  'Map::Room',
    foreign_key: 'page_id'
  
end
