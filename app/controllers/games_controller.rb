class GamesController < ApplicationController
  
  before_action :load_game, only: %i[show edit update destroy]
  before_action :require_user
  before_action :require_author_of_game, only: %i[show edit update destroy]
  before_action :require_player_in_game, only: %i[show]

  def index
    @players = current_user&.players
    @games   = current_user&.games
  end

  def show
    @maps = @game.maps
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.new game_params
    @game.author = current_user

    if @game.save
      redirect_to @game, notice: t('.game_created')
    else
      flash.now[:alert] = t('.game_invalid')
      render :new
    end
  end

  def edit
    @game
  end

  def update
    if @game.update(game_params)
      flash[:notice] = t('.game_updated')
      redirect_to @game
    else
      flash.now[:alert] = t('.game_invalid')
      render :edit
    end
  end

  def destroy
    @game.destroy

    redirect_to games_url, notice: t('.game_destroyed')
  end

  private

  def load_game
    @game = Game.find params[:id]
  end

  def game_params
    params.require(:game).permit(%i[
      title
      description
    ],
      compendium_ids: []
    )
  end
end

