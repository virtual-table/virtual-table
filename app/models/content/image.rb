module Content
  class Image < ApplicationRecord
    
    has_one_attached :file
    
    has_one :page_content,
      foreign_key:  :content_id,
      foreign_type: :content_type
    
    def self.accessible_attributes
      %i[ file alt_text caption ]
    end
    
  end
end
