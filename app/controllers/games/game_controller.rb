module Games
  class GameController < ::ApplicationController
    
    before_action :require_user
    before_action :load_game
    
    private
    
    def current_game
      load_game
    end
    helper_method :current_game
    
    def load_game
      @game ||= Game.find params[:game_id]
    end
    
  end
end
