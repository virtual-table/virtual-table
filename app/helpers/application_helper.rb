module ApplicationHelper
  def bulma_form_for(record, options = {}, &block)
    options[:builder] = BulmaFormBuilder
    form_for(record, options, &block)
  end
  
  def bulma_form_with(options = {}, &block)
    options[:builder] = BulmaFormBuilder
    form_with(options, &block)
  end
  
  def bulma_form_contents_for(record, options = {}, &block)
    options[:builder] = BulmaFormBuilder
    
    form_for(record, options) do |form|
      return yield form
    end
  end
  
  def site_title
    'VirtualTable'
  end
  
  def site_subtitle
    t('.subtitle')
  end
  
  def page_title
    main_title = strip_tags(title.to_s).presence
    sub_title  = strip_tags(subtitle.to_s).presence
    
    if main_title.present?
      parts = [main_title, sub_title || site_title]
    else
      parts = [site_title, sub_title || site_subtitle]
    end
    
    page_title = parts.compact.join(' - ')
    page_title.html_safe
  end
  
  # Store the title or return it if no argument is given.
  def title(new_title = nil)
    if new_title
      @page_title = new_title
    else
      @page_title || ''
    end
  end
  
  # Store the title or return it if no argument is given.
  def subtitle(new_subtitle = nil)
    if new_subtitle
      @page_subtitle = new_subtitle
    else
      @page_subtitle || ''
    end
  end
end
