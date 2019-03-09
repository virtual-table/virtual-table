class Player < ApplicationRecord
  
  ROLES = %w[ gm player ]
  
  belongs_to :game
  
  belongs_to :user
  
  validates :role,
    inclusion: { in: ROLES }
  
end
