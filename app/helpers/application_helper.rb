module ApplicationHelper
  def bulma_form_for(record, options = {}, &block)
    options[:builder] = BulmaFormBuilder
    form_for(record, options, &block)
  end
end
