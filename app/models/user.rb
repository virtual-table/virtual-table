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
  
  private
  
  def validate_roles
    self.roles = Array(roles).map(&:presence).compact
    
    unless roles.all? { |role| ROLES.include?(role) }
      errors.add :roles, :invalid
      return false
    end
  end
  
end
