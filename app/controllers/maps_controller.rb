class MapsController < ApplicationController
  
  def show
    @map = Map.find params[:id]
    if params[:floor_id]
      @active_floor = @map.floors.find params[:floor_id]
    else
      @active_floor = @map.floors.first
    end
  end
  
  def edit
    @map = Map.find params[:id]
  end
  
end
