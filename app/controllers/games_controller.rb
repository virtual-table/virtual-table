class GamesController < ApplicationController
  
  before_action :require_user
  
  def index
    @games = Game.all
  end
  
  def show
    @game = Game.find params[:id]
  end
  
  def new
    @game = Game.new
  end
  
  def create
    @game = Game.new game_params
    @game.author = current_user
    
    if @game.valid?
      @game.save
      redirect_to @game, notice: t('.game_created')
    else
      flash.now[:alert] = t('.game_invalid')
      render :new
    end
  end
  
  def edit
    @game = Game.find params[:id]
  end
  
  def update
    @game = Game.find params[:id]
    if @game.update(game_params)
      flash[:notice] = t('.game_updated')
      redirect_to @game
    else
      flash.now[:alert] = t('.game_invalid')
      render :edit
    end
  end
  
  def destroy
    @game = Game.find params[:id]
    @game.destroy
    
    redirect_to games_url, notice: t('.game_destroyed')
  end
  
  private
  
  def game_params
    params.require(:game).permit(%i[
      title
      description
    ])
  end
end
