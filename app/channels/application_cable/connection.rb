module ApplicationCable
  class Connection < ActionCable::Connection::Base
    
    attr_accessor :current_games
    
    identified_by :current_user
    
    def connect
      self.current_user = find_verified_user
      logger.add_tags 'ActionCable', "User #{current_user.id}"
    end
    
    protected
    
    def find_verified_user
      verified_user_id = cookies.encrypted[:user_id].presence
      verified_user    = User.find_by(id: verified_user_id) if verified_user_id
      
      verified_user || reject_unauthorized_connection
    end
    
  end
end
