class Page::RoomPage < ::Page
  
  has_one :area,
    class_name:  'Map::Room',
    foreign_key: 'page_id',
    dependent:   :destroy
  
  after_update :update_area
  
  private
  
  def update_area
    area.title = title
    area.save if area.changed?
  end
end
