class Compendium < ApplicationRecord
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :pages
  
  has_many :maps
  
  has_many :game_compendiums
  
  has_many :games,
    through: :game_compendiums
  
  def description_html
    description&.html_safe
  end
  
end
