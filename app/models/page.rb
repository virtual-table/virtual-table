class Page < ApplicationRecord
  
  belongs_to :compendium
  
  belongs_to :parent,
    class_name: 'Page',
    optional: true
  
  has_many :children,
    class_name: 'Page',
    foreign_key: 'parent_id'
  
  has_many :contents,
    -> { order(position: :asc) },
    class_name: 'PageContent'
  
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
    Content.constants.map do |constant|
      Content.const_get(constant)
    end.find_all do |constant|
      constant < ApplicationRecord
    end
  end
  
end
