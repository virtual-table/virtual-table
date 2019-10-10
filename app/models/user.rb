
class User < ApplicationRecord
  attr_accessor :activation_token
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
    uniqueness: { case_sensitive: false }
  
  validate :validate_roles

  before_create :generate_reset_token, :create_activation_digest
  before_save :downcase_email 

  
  def self.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
    BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end 

  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?
    BCrypt::Password.new(digest).is_password?(token)
  end 

  def self.secure_token
    SecureRandom.urlsafe_base64
  end
  
  def join!(game)
    unless game.users.include?(self)
      game.players.create user: self, role: 'player'
    end
  end
  
  def create_reset_token
    update!(
      reset_token:   User.secure_token,
      reset_send_at: Time.now.utc
    )
    
    self.reset_token
  end
   
  def activate 
    self.update_attribute(:activated, true)
    self.update_attribute(:activated_at, Time.zone.now)
  end

  def send_activation_email
    AccountMailer.account_activation(self).deliver_now
  end 
  
  def activation_expired?
    activation_send_at < 2.hours.ago
  end 

  private
  
  def generate_reset_token
    self.reset_token = User.secure_token
  end
  
  def validate_roles
    self.roles = Array(roles).map(&:presence).compact
    
    unless roles.all? { |role| ROLES.include?(role) }
      errors.add :roles, :invalid
      return false
    end
  end

  def create_activation_digest
    self.activation_token = User.secure_token
    self.activation_digest = User.digest(activation_token)
    self.activation_send_at = Time.zone.now
  end 

  def downcase_email
    self.email = email.downcase
  end 
end
