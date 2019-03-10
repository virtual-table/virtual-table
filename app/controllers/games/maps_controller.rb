module Games
  class MapsController < GameController
    def new
      @map = @game.maps.new
    end
    
    def create
      @map = @game.maps.build map_params
      
      if @map.save
        redirect_to @map, notice: t('.map_created')
      else
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
