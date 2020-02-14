class CompendiaController < ApplicationController

  before_action :load_compendium, only: %i[show edit update destroy]
  before_action :require_author_of_compendium, only: %i[edit update destroy]
  before_action :require_author_or_player, only: %i[show]

  def index
    @compendia = current_user&.compendia
  end

  def show
    @pages = @compendium.pages.without_parent
    @maps  = @compendium.maps
  end

  def new
    @compendium = Compendium.new
  end

  def create
    @compendium = Compendium.new compendium_params
    @compendium.author = current_user

    if @compendium.save
      redirect_to @compendium, notice: t('.compendium_created', compendium: @compendium.title)
    else
      flash.now[:alert] = t('.compendium_invalid')
      render :new
    end
  end

  def edit
    @compendium
  end

  def update
    if @compendium.update(compendium_params)
      flash[:notice] = t('.compendium_updated', compendium: @compendium.title)
      redirect_to @compendium
    else
      flash.now[:alert] = t('.compendium_invalid')
      render :edit
    end
  end

  def destroy
    @compendium.destroy

    redirect_to compendia_url, notice: t('.compendium_destroyed', compendium: @compendium.title)
  end

  private

  def load_compendium
    @compendium = Compendium.find params[:id]
  end

  def require_author_or_player
    return if @compendium.author == current_user
    return if @compendium.games.any? { |game| game.players.any? { |player| current_user.players.include? player } }

    flash[:alert] = t('.author_or_player_required')
    redirect_to login_url
    return false
  end

  def compendium_params
    params.require(:compendium).permit(%i[
      title
      description
      cover
      public
    ])
  end
end
