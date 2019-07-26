class Map::Area < ApplicationRecord
  
  has_many :area_pages,
    class_name: 'Map::AreaPage'
  
  has_many :pages,
    through: :area_pages
  
  belongs_to :floor
  
  delegate :map, to: :floor,
    allow_nil: true
  
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
