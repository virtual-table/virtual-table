class Game < ApplicationRecord
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :players
  
  has_many :users, 
    through: :players
  
  has_many :game_compendia
  
  has_many :compendia,
    through: :game_compendia
  
  has_many :maps,
    through: :compendia
  
  after_create :add_author_as_player
  
  def add_author_as_player
    unless users.include?(author)
      players.create user: author, role: 'gm'
    end
  end
  
  def description_html
    description&.html_safe
  end
  
end
