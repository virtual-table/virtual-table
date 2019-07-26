class Map::Floor < ApplicationRecord
  
  belongs_to :page,
    class_name: 'Page::FloorPage',
    autosave:   true,
    dependent:  :destroy
  
  belongs_to :map
  
  has_many :backgrounds,
    dependent: :destroy
  
  has_many :areas,
    dependent: :destroy
  
  has_many :walls,
    dependent: :destroy
  
  has_many :doors,
    dependent: :destroy
  
  has_many :characters,
    dependent: :destroy
  
  before_validation :build_page,  on: :create
  before_validation :update_page, on: :update
  
  validates :title,
    presence: true
  
  def width
    columns * grid_size
  end
  
  def height
    rows * grid_size
  end
  
  def grid_size
    50
  end
  
  def build_page(attributes = {})
    super attributes.merge(
      compendium: map.compendium,
      title:      title,
      parent:     map.page
    )
  end
  
  def update_page
    page.title  = title
    page.parent = map.page
  end
end
