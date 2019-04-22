module Compendia
  class MapsController < CompendiumController
    def new
      @map = @compendium.maps.new
    end
    
    def create
      @map = @compendium.maps.build map_params
      
      if @map.save
        redirect_to @map, notice: t('.map_created')
      else
        raise @map.errors.inspect
        flash.now[:alert] = t('.map_invalid')
        render :new
      end
    end
    
    private
    
    def map_params
      params.require(:map).permit(%i[
        title
      ])
    end
  end
end
