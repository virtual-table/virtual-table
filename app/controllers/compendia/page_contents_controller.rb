module Compendia
  class PageContentsController < CompendiumController
    
    before_action :load_page
    
    def new
      @page_content = @page.contents.build
      @page_content.position = (params[:position].presence || @page.contents.count).to_i
      @page_content.content  = build_content
      
      render layout: !request.xhr?
    end
    
    private
    
    def load_page
      @page = @compendium.pages.find params[:page_id]
    end
    
    def build_content
      content_type = \
        @page.available_content_types.find do |type|
          type.to_s == params[:content_type]
        end
      content_type.new
    end
    
  end
end