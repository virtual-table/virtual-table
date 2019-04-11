class Page < ApplicationRecord
  
  belongs_to :compendium
  
  belongs_to :parent,
    class_name: 'Page',
    optional: true
  
  has_many :children,
    class_name: 'Page',
    foreign_key: 'parent_id'
  
  scope :without_parent, -> { where parent: nil }
  
  def depth
    if parent
      parent.depth + 1
    else
      0
    end
  end
  
end
