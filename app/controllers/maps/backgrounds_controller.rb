module Maps
  class BackgroundsController < MapController
    def show
      @background = @map.backgrounds.find params[:id]
      redirect_to map_floor_url(@map, @background.floor)
    end
    
    def new
      @background = @map.backgrounds.new background_params
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
    
    def update
      @background = @map.backgrounds.find params[:id]
      if @background.update(background_params)
        redirect_to map_background_url(@map, @background), notice: t('.background_updated')
      else
        flash.now[:alert] = t('.background_invalid')
        render :edit
      end
    end
    
    private
    
    def background_params
      params.fetch(:map_background, {}).permit(%i[
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
