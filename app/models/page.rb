class Page < ApplicationRecord
  
  belongs_to :compendium
  
  belongs_to :parent,
    class_name: 'Page',
    optional: true
  
  has_many :children,
    class_name:  'Page',
    foreign_key: 'parent_id',
    dependent:   :destroy
  
  has_many :contents,
    -> { order(position: :asc) },
    class_name: 'PageContent',
    inverse_of: :page,
    autosave:   true,
    dependent:  :destroy
  
  accepts_nested_attributes_for :contents,
    allow_destroy: true
  
  scope :without_parent, -> { where parent: nil }
  
  def depth
    if parent
      parent.depth + 1
    else
      0
    end
  end
  
  def available_content_types
    PageContent.available_content_types
  end
  
end
