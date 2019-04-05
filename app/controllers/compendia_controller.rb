class CompendiaController < ApplicationController
  def index
    @compendia = Compendium.where(public: true).all
  end
  
  def show
    @compendium = Compendium.find params[:id]
  end
  
  def new
    @compendium = Compendium.new
  end
  
  def create
    @compendium = Compendium.new compendium_params
    @compendium.author = current_user
    
    if @compendium.save
      redirect_to @compendium, notice: t('.compendium_created')
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
      flash[:notice] = t('.compendium_updated')
      redirect_to @compendium
    else
      flash.now[:alert] = t('.compendium_invalid')
      render :edit
    end
  end
  
  def destroy
    @compendium = Compendium.find params[:id]
    @compendium.destroy
    
    redirect_to compendia_url, notice: t('.compendium_destroyed')
  end
  
  private
  
  def compendium_params
    params.require(:compendium).permit(%i[
      title
      description
      public
    ])
  end
end
