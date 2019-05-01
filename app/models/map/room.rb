class Map::Room < ApplicationRecord
  
  belongs_to :page,
    class_name: 'Page::RoomPage',
    autosave:   true,
    dependent:  :destroy
  
  belongs_to :floor
  
  delegate :map, to: :floor,
    allow_nil: true
  
  before_validation :build_page,  on: :create
  before_validation :update_page, on: :update
  
  validate :validate_bounds_json
  
  def full_title
    [short_code, title].compact.join('. ')
  end
  
  def bounds_json
    @bounds_json || (bounds || []).to_json
  end
  
  def bounds_json=(new_bounds)
    @bounds_json = new_bounds
    
    if valid_json?(new_bounds)
      self.bounds  = JSON.parse(new_bounds)
      @bounds_json = bounds.to_json
    end
  end
  
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
  
  private
  
  def validate_bounds_json
    if @bounds_json.present? && !valid_json?(@bounds_json)
      errors.add(:bounds_json, :invalid)
      return false
    end
  end
  
  def valid_json?(json)
    JSON.parse(json)
    return true
  rescue JSON::ParserError => e
    return false
  end
end
