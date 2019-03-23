module Maps
  class FloorsController < MapController
    def show
      redirect_to map_url(@map, floor_id: params[:id])
    end
    
    def new
      @floor = @map.floors.new
    end
    
    def create
      @floor = @map.floors.build floor_params
      if @floor.save
        redirect_to map_floor_url(@map, @floor), notice: t('.floor_created')
      else
        flash.now[:alert] = t('.floor_invalid')
        render :new
      end
    end
    
    def edit
      @floor = @map.floors.find params[:id]
    end
    
    def update
      @floor = @map.floors.find params[:id]
      if @floor.update(floor_params)
        redirect_to map_floor_url(@map, @floor), notice: t('.floor_updated')
      else
        flash.now[:alert] = t('.floor_invalid')
        render :edit
      end
    end
    
    private
    
    def floor_params
      params.require(:map_floor).permit(%i[
        title
        level
        columns
        rows
        scale
        scale_unit
        background_color
        grid
        grid_color
        grid_opacity
        global_illumination
      ])
    end
  end
end
