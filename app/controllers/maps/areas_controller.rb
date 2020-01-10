module Maps
  class AreasController < MapController
    def show
      @area = @map.areas.find params[:id]
      redirect_to map_floor_url(@map, @area.floor)
    end
    
    def new
      @area = @map.areas.new area_params
    end
    
    def create
      @area = @map.areas.build area_params
      if @area.save
        redirect_to map_area_url(@map, @area), notice: t('.area_created')
      else
        flash.now[:alert] = t('.area_invalid')
        render :new
      end
    end
    
    def edit
      @area = @map.areas.find params[:id]
    end
    
    def update
      @area = @map.areas.find params[:id]
      
      if @area.update(area_params)
        redirect_to map_area_url(@map, @area), notice: t('.area_updated')
      else
        flash.now[:alert] = t('.area_invalid')
        render :edit
      end
    end
    
    private
    
    def area_params
      params.fetch(:map_area, {}).permit(%i[
        short_code
        title
        floor_id
        x y
        bounds_json
      ],
        page_ids: []
      ).tap do |area|
        area[:page_ids] = area[:page_ids].map { |id| id.presence&.to_i }.compact if area[:page_ids]
      end
    end
  end
end
