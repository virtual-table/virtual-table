module Compendia
  class CompendiumController < ApplicationController
    
    before_action :load_compendium
    
    private
    
    def load_compendium
      @compendium = Compendium.find params[:compendium_id]
    end
    
  end
end
