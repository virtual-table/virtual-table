class User < ApplicationRecord
  
  ROLES = %w[ admin ]
  
  has_secure_password
  
  has_many :compendia,
    foreign_key: 'author_id'
  
  has_many :players
  
  has_many :games,
    through: :players
  
  validates :name,
    presence: true
  
  validates :email,
    presence:   true,
    uniqueness: true
  
  validate :validate_roles
  
  def self.secure_token
    SecureRandom.urlsafe_base64
  end
  
  def join!(game)
    unless game.users.include?(self)
      game.players.create user: self, role: 'player'
    end
  end
  
  def create_reset_token
    update_attributes!(
      reset_token:   User.secure_token,
      reset_send_at: Time.now.utc
    )
    
    self.reset_token
  end
  
  private
  
  def validate_roles
    self.roles = Array(roles).map(&:presence).compact
    
    unless roles.all? { |role| ROLES.include?(role) }
      errors.add :roles, :invalid
      return false
    end
  end
  
end
