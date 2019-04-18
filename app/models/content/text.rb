module Content
  class Text < ApplicationRecord
    
    has_one :page_content,
      foreign_key:  :content_id,
      foreign_type: :content_type
    
    def self.accessible_attributes
      %i[ title description ]
    end
    
    has_rich_text :description
    
  end
end
