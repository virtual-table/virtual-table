module Games
    class SessionsController < ApplicationController
    
    before_action :load_game, except: :index
    
    before_action :require_player
    
    def index
      redirect_to games_url
    end
    
    def show
      @session = @game.sessions.find params[:id]
      @map     = @session.map || @game.maps.first
      @floor   = @map.try { |m| m.floors.first }
    end
    
    def create
      @session = @game.sessions.build session_params
      @session.author = current_user
      
      if @session.save
        redirect_to game_play_url(@game, @session)
      else
        flash.now[:alert] = t('.game_invalid')
        render :new
      end
    end
    
    private
    
    def load_game
      @game = Game.find params[:game_id]
    end
    
    def session_params
      params.require(:game_session).permit(:subject)
    end
  end
end