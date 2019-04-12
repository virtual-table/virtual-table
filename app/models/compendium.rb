class Compendium < ApplicationRecord
  
  has_rich_text :description
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :pages
  
  has_many :maps
  
  has_many :game_compendiums
  
  has_many :games,
    through: :game_compendiums
  
end
