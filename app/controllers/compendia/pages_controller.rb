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
      if @page.save
        redirect_to [@compendium, @page.becomes(Page)], notice: t('.page_created')
      else
        flash.now[:alert] = t('.page_invalid')
        render :new
      end
    end
    
    def show
      @page = @compendium.pages.find params[:id]
    end
    
    def edit
      @page = @compendium.pages.find params[:id]
    end
    
    def update
      @page = @compendium.pages.find params[:id]
      if @page.update(page_params)
        redirect_to [@compendium, @page.becomes(Page)], notice: t('.page_updated')
      else
        flash.now[:alert] = t('.page_invalid')
        render :edit
      end
    end
    
    def destroy
      @page = @compendium.pages.find params[:id]
      @page.destroy
    
      redirect_to @compendium, notice: t('.page_destroyed')
    end
    
    private
    
    def page_params
      params.fetch(:page, {}).permit(*%i[
        title
        position
        parent_id
      ],
        contents_attributes: [
          %i[ id position visible _destroy content_type content_id ],
          content_attributes: whitelisted_content_attributes
        ]
      )
    end
    
    def whitelisted_content_attributes
      %i[ id ] + (@page&.available_content_types || []).map do |type|
        type.accessible_attributes
      end.uniq
    end
    
  end
end
