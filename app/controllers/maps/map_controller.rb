module Maps
  class MapController < ApplicationController
    
    before_action :require_user
    before_action :load_map
    
    private
    
    def load_map
      @map = Map.find params[:map_id]
    end
    
  end
end
