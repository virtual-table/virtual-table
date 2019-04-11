module Compendia
  class PagesController < CompendiumController
    
    def index
      redirect_to @compendium
    end
    
    def new
      @page = @compendium.pages.new page_params
    end
    
    def create
      @page = @compendium.pages.build page_params
    end
    
    def show
      @page = @compendium.pages.find params[:id]
    end
    
    def edit
      @page = @compendium.pages.find params[:id]
    end
    
    def update
      @page = @compendium.pages.find params[:id]
    end
    
    def destroy
      @page = @compendium.pages.find params[:id]
      @page.destroy
    
      redirect_to @compendium, notice: t('.page_destroyed')
    end
    
    private
    
    def page_params
      params.fetch(:page, {}).permit(%i[
        title
        position
        parent_id
      ])
    end
    
  end
end
