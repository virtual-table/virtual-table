class User < ApplicationRecord
  
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
  
end
