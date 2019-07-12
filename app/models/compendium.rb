class Compendium < ApplicationRecord
  
  has_one_attached :cover
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :pages,
    -> { order(position: :asc) }
  
  has_many :maps
  
  has_many :game_compendiums
  
  has_many :games,
    through: :game_compendiums
  
  def description_html
    description&.html_safe
  end
  
end
