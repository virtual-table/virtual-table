class CompendiaController < ApplicationController
  def index
    @compendia = current_user&.compendia
  end
  
  def show
    @compendium = Compendium.find params[:id]
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
    @compendium = Compendium.find params[:id]
  end
  
  def update
    @compendium = Compendium.find params[:id]
    
    if @compendium.update(compendium_params)
      flash[:notice] = t('.compendium_updated', compendium: @compendium.title)
      redirect_to @compendium
    else
      flash.now[:alert] = t('.compendium_invalid')
      render :edit
    end
  end
  
  def destroy
    @compendium = Compendium.find params[:id]
    @compendium.destroy
    
    redirect_to compendia_url, notice: t('.compendium_destroyed', compendium: @compendium.title)
  end
  
  private
  
  def compendium_params
    params.require(:compendium).permit(%i[
      title
      description
      cover
      public
    ])
  end
end
