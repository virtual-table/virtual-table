module Content
  class Text < ApplicationRecord
    
    def self.accessible_attributes
      %i[ title description ]
    end
    
    has_rich_text :description
    
  end
end
