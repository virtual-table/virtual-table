module Content
  class Text < ApplicationRecord
    
    has_one :page_content,
      foreign_key:  :content_id,
      foreign_type: :content_type
    
    def self.accessible_attributes
      %i[ title description ]
    end
    
    def description_html
      description&.html_safe
    end
    
  end
end
