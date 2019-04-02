class GameSessionsController < ApplicationController
  
  before_action :load_game, except: :index
  
  before_action :require_player
  
  def index
    redirect_to games_url
  end
  
  def show
    @map = @game.maps.first
    @active_floor = @map.floors.first
  end
  
  private
  
  def load_game
    @game = Game.find params[:id]
  end
end
