class Map < ApplicationRecord
  
  belongs_to :page,
    class_name: 'Page::MapPage',
    autosave:   true,
    dependent:  :destroy
  
  belongs_to :compendium
  
  has_many :floors,
    -> { order(level: :desc) },
    class_name: 'Map::Floor',
    dependent:  :destroy
  
  has_many :backgrounds,
    through: :floors
  
  has_many :characters,
    through: :floors
  
  has_many :areas,
    through: :floors
  
  has_many :walls,
    through: :floors
  
  has_many :doors,
    through: :floors
  
  before_validation :build_page,  on: :create
  before_validation :update_page, on: :update
  
  def width
    floors.map(&:width).max
  end
  
  def height
    floors.map(&:height).max
  end
  
  def build_page(attributes = {})
    super attributes.merge(compendium: compendium, title: title)
  end
  
  def update_page
    page.title = title
  end
end
