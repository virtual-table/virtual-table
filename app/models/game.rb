class Game < ApplicationRecord
  
  belongs_to :author,
    class_name: 'User'
  
  has_many :players,
    dependent: :destroy
  
  has_many :users, 
    through: :players
  
  has_many :sessions,
    class_name: 'GameSession'
  
  has_many :game_compendia,
    dependent: :destroy
  
  has_many :compendia,
    through: :game_compendia
  
  has_many :maps,
    through: :compendia
  
  before_save :generate_invite_code, unless: :invite_code?
  
  after_create :add_author_as_player
  
  def generate_invite_code
    self.invite_code = SecureRandom.urlsafe_base64
  end
  
  def generate_invite_code!
    self.invite_code = SecureRandom.urlsafe_base64
    save
  end
  
  def add_author_as_player
    unless users.include?(author)
      players.create user: author, role: 'gm'
    end
  end
  
  def description_html
    description&.html_safe
  end
  
end
