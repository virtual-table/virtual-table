class Compendium < ApplicationRecord
  
  has_one_attached :cover
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :pages,
    -> { order(position: :asc) },
    dependent: :destroy
  
  has_many :maps,
    dependent: :destroy
  
  has_many :game_compendiums,
    dependent: :destroy
  
  has_many :games,
    through: :game_compendiums
  
  validates :title,
    presence: true
  
  def description_html
    description&.html_safe
  end
  
end
