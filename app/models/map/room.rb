class Map::Room < ApplicationRecord
  
  belongs_to :page,
    class_name: 'Page::RoomPage',
    autosave:   true,
    dependent:  :destroy
  
  belongs_to :floor
  
  delegate :map, to: :floor,
    allow_nil: true
  
  has_many :walls,
    dependent: :destroy
  
  has_many :doors,
    dependent: :destroy
  
  before_validation :build_page,  on: :create
  before_validation :update_page, on: :update
  
  def build_page(attributes = {})
    super attributes.merge(
      compendium: map.compendium,
      title:      title,
      parent:     floor.page
    )
  end
  
  def update_page
    page.title  = title
    page.parent = floor.page
  end
end
