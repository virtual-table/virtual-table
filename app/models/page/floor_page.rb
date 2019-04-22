class Page::FloorPage < ::Page
  
  has_one :floor,
    class_name:  'Map::Floor',
    foreign_key: 'page_id',
    dependent:   :destroy
  
  after_update :update_floor
  
  private
  
  def update_floor
    floor.title = title
    floor.save if floor.changed?
  end
end