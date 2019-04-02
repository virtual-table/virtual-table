module Maps
  class DoorsController < MapController
    def edit
      @door = @map.doors.find params[:id]
    end
    
    def update
      @door = @map.doors.find params[:id]
      if @door.update(door_params)
        redirect_to map_floor_url(@map, @door), notice: t('.floor_updated')
      else
        flash.now[:alert] = t('.floor_invalid')
        render :edit
      end
    end
    
    private
    
    def door_params
      params.require(:map_door).permit(%i[
        room_id
        origin_x      origin_y
        destination_x destination_y
        closed
      ])
    end
  end
end
