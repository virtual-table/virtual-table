class GameSessionsController < ApplicationController
  def index
    redirect_to games_url
  end
  
  def show
    @game = Game.find params[:id]
    @map = @game.maps.first
    @active_floor = @map.floors.first
  end
end
