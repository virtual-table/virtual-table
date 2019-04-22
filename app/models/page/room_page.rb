class Page::RoomPage < ::Page
  
  has_one :room,
    class_name:  'Map::Room',
    foreign_key: 'page_id',
    dependent:   :destroy
  
  after_update :update_room
  
  private
  
  def update_room
    room.title = title
    room.save if room.changed?
  end
end
