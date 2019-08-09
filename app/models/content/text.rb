module Content
  class Text < ApplicationRecord
    
    has_one :page_content,
      foreign_key:  :content_id,
      foreign_type: :content_type
    
    has_one :page,
      through: :page_content
    
    def self.accessible_attributes
      %i[ description ]
    end
    
    def description_html
      description&.html_safe
    end
    
  end
end
