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
end
