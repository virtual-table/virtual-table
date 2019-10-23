class Player < ApplicationRecord
  
  ROLES = %w[ gm player ]
  
  belongs_to :game
  
  belongs_to :session,
    class_name: 'GameSession',
    optional:   true
  
  belongs_to :user
  
  validates :role,
    inclusion: { in: ROLES }
  
  delegate :name, to: :user
  
  ROLES.each do |role|
    define_method "is_#{role}?" do
      self.role == role
    end
  end
  
  def join!(session)
    self.session = session
    save! if session_id_changed?
  end
  
end
