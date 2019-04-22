class Page::MapPage < ::Page
  
  has_one :map,
    foreign_key: 'page_id',
    dependent:   :destroy
  
  after_update :update_map
  
  private
  
  def update_map
    map.title = title
    map.save if map.changed?
  end
end
