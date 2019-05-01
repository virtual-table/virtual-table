module Maps
  class RoomsController < MapController
    def show
      @room = @map.rooms.find params[:id]
      redirect_to map_floor_url(@map, @room.floor)
    end
    
    def new
      @room = @map.rooms.new room_params
    end
    
    def create
      @room = @map.rooms.build room_params
      if @room.save
        redirect_to map_room_url(@map, @room), notice: t('.room_created')
      else
        flash.now[:alert] = t('.room_invalid')
        render :new
      end
    end
    
    def edit
      @room = @map.rooms.find params[:id]
    end
    
    def update
      @room = @map.rooms.find params[:id]
      if @room.update(room_params)
        redirect_to map_room_url(@map, @room), notice: t('.room_updated')
      else
        flash.now[:alert] = t('.room_invalid')
        render :edit
      end
    end
    
    private
    
    def room_params
      params.fetch(:map_room, {}).permit(%i[
        short_code
        title
        floor_id
        bounds_json
      ])
    end
  end
end
