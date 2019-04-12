class Compendium < ApplicationRecord
  
  has_rich_text :description
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :pages
  
  has_many :maps
  
end
