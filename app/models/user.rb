class User < ApplicationRecord
  
  ROLES = %w[ admin ]
  
  attr_accessor :activation_token
  
  has_secure_password
  
  ### ASSOCIATIONS:
  
  has_many :compendia,
    foreign_key: 'author_id'
  
  has_many :players
  
  has_many :games,
    through: :players
  
  ### VALIDATIONS:
  
  validates :name,
    presence: true
  
  validates :email,
    presence:   true,
    uniqueness: { case_sensitive: false }
  
  validate :validate_roles
  
  ### CALLBACKS:
  
  before_create :generate_reset_token
  
  before_create :generate_activation_digest
  
  before_save :downcase_email
  
  ### CLASS METHODS:
  
  def self.digest(string)
    cost = \
      if ActiveModel::SecurePassword.min_cost
        BCrypt::Engine::MIN_COST
      else
        BCrypt::Engine.cost
      end
    
    BCrypt::Password.create(string, cost: cost)
  end 
  
  def self.secure_token
    SecureRandom.urlsafe_base64
  end
  
  ### INSTANCE METHODS:
  
  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?
    BCrypt::Password.new(digest).is_password?(token)
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
  
  def reset_activation_token
    generate_activation_digest
  end

  def reset_activation_token!
    generate_activation_digest
    save
  end

  def activate(token)
    if BCrypt::Password.new(self.activation_digest).is_password?(token)
      update!(
        activated:    true,
        activated_at: Time.now.utc
      )
      return true
    end
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
  
  def generate_activation_digest
    self.activation_token   = User.secure_token
    self.activation_digest  = User.digest(activation_token)
    self.activation_send_at = Time.now.utc
  end 
  
  def downcase_email
    self.email = email.downcase
  end 
end
