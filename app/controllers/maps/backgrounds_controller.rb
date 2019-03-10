module Maps
  class BackgroundsController < MapController
    def show
      @background = @map.backgrounds.find params[:id]
    end
    
    def new
      @background = @map.backgrounds.new
    end
    
    def create
      @background = @map.backgrounds.build background_params
      if @background.save
        redirect_to map_background_url(@map, @background), notice: t('.background_created')
      else
        flash.now[:alert] = t('.background_invalid')
        render :new
      end
    end
    
    def edit
      @background = @map.backgrounds.find params[:id]
    end
    
    private
    
    def background_params
      params.require(:map_background).permit(%i[
        image
        floor_id
        width
        height
        x
        y
      ])
    end
  end
end
