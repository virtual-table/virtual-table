class Game < ApplicationRecord
  
  has_rich_text :description
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :players
  
  has_many :users, 
    through: :players
  
  has_many :maps
  
  after_create :add_author_as_player
  
  def add_author_as_player
    unless users.include?(author)
      players.create user: author, role: 'gm'
    end
  end
  
end
