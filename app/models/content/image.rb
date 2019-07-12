module Content
  class Image < ApplicationRecord
    
    has_one_attached :file
    
    has_one :page_content,
      foreign_key:  :content_id,
      foreign_type: :content_type
    
    def self.accessible_attributes
      %i[ file alt_text caption random_number ]
    end
    
    def caption_html
      caption.html_safe
    end
    
    # Unfortunately, only changing the `file` doesn't trigger an update
    # of the image, so use this as a workaround:
    def random_number
      @random_number ||= rand(1_000_000)
    end
    
    def random_number=(new_number)
      updated_at_will_change! unless new_number == random_number
      @random_number = new_number
    end
    
  end
end
