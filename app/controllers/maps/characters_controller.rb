module Maps
  class CharactersController < MapController
    def show
      @character = @map.characters.find params[:id]
      redirect_to map_floor_url(@map, @character.floor)
    end
    
    def new
      @character = @map.characters.new character_params
    end
    
    def create
      @character = @map.characters.build character_params
      if @character.save
        redirect_to map_character_url(@map, @character), notice: t('.character_created')
      else
        flash.now[:alert] = t('.character_invalid')
        render :new
      end
    end
    
    def edit
      @character = @map.characters.find params[:id]
    end
    
    def update
      @character = @map.characters.find params[:id]
      if @character.update(character_params)
        redirect_to map_character_url(@map, @character), notice: t('.character_updated')
      else
        flash.now[:alert] = t('.character_invalid')
        render :edit
      end
    end
    
    private
    
    def character_params
      params.fetch(:map_character, {}).permit(%i[
        name
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
