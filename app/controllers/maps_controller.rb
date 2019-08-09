class MapsController < ApplicationController
  
  def show
    @map = Map.find params[:id]
    @compendium = @map.compendium
    
    if params[:floor_id]
      @active_floor = @map.floors.find params[:floor_id]
    else
      @active_floor = @map.floors.first
    end
  end
  
  def edit
    @map = Map.find params[:id]
  end
  
  def update
    @map = Map.find params[:id]
    if @map.update(map_params)
      redirect_to map_url(@map), notice: t('.map_updated')
    else
      flash.now[:alert] = t('.map_invalid')
      render :edit
    end
  end
  
  private
  
  def map_params
    params.require(:map).permit(%i[
      title
    ])
  end
end
