class MapsController < ApplicationController
  
  def show
    @map = Map.find params[:id]
  end
  
  def edit
    @map = Map.find params[:id]
  end
  
end
