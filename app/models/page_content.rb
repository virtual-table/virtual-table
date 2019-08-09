class PageContent < ApplicationRecord
  
  belongs_to :page
  
  belongs_to :content,
    polymorphic: true,
    dependent:   :destroy,
    inverse_of:  :page_content,
    autosave:    true
  
  accepts_nested_attributes_for :content
  
  def self.available_content_types
    Content.constants.map do |constant|
      Content.const_get(constant)
    end.find_all do |constant|
      constant < ApplicationRecord
    end
  end
  
  def build_content(params = {})
    if content_type? && valid_content_type?
      self.content = content_type.safe_constantize.new(params)
    end
  end
  
  private
  
  def valid_content_type?
    self.class.available_content_types.any? { |type| type.to_s == content_type }
  end
  
end
