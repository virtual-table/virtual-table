class Player < ApplicationRecord
  
  ROLES = %w[ gm player ]
  
  belongs_to :game
  
  belongs_to :user
  
  validates :role,
    inclusion: { in: ROLES }
  
  delegate :name, to: :user
  
  ROLES.each do |role|
    define_method "is_#{role}?" do
      self.role == role
    end
  end
  
end
