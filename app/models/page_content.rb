class PageContent < ApplicationRecord
  
  belongs_to :page
  
  belongs_to :content,
    polymorphic: true,
    dependent:   :destroy
  
  accepts_nested_attributes_for :content
  
end
