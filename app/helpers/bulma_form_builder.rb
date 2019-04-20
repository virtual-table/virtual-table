class BulmaFormBuilder < ActionView::Helpers::FormBuilder
  
  delegate :content_tag, to: :@template
  delegate :t, to: :@template
  
  def label(method, text = nil, options = {}, &block)
    super(method, text, insert_class('label', options), &block)
  end
  
  {
    text_field:     'input',
    email_field:    'input',
    password_field: 'input',
    text_area:      'input'
  }.each do |selector, input_class|
    class_eval <<-RUBY_EVAL, __FILE__, __LINE__ + 1
      def #{selector}(method, options = {})
        control_options = options.delete(:control) || {}
        control_options[:class] = 'is-danger' if invalid?(method)
        
        input_class  = '#{input_class}'
        input_class << ' is-danger' if invalid?(method)
        
        content_tag(
          :div,
          super(method, insert_class(input_class, options)),
          insert_class('control', control_options)
        )
      end
    RUBY_EVAL
  end
  
  def field(method, options = {}, &block)
    content = @template.capture &block
    
    field_options = options.delete(:control) || {}
    field_options[:class] = 'is-danger' if invalid?(method)
    
    content_tag(
      :div,
      content,
      insert_class('field', field_options)
    )
  end
  
  def errors(method)
    messages = object.errors.full_messages_for(method)
    messages.map do |message|
      help_block(message, class: 'is-danger')
    end.join.html_safe
  end
  
  def help_block(message, options = {})
    html_class = [
      'help', options[:class]
    ].compact.join(' ')
    
    content_tag(:p, message, class: html_class)
  end
  
  def submit_or_reset
    content_tag(
      :div,
      content_tag(
        :div,
        button(t('.submit'), type: 'submit', class: 'button'),
        class: 'control'
      ) <<
      content_tag(
        :div,
        button(t('.reset'), type: 'reset', class: 'button is-text'),
        class: 'control'
      ),
      class: 'field is-grouped'
    )
  end
  
  private
  
  def invalid?(method)
    object&.errors&.has_key?(method)
  end
  
  def insert_class(class_name, options)
    output = options.dup
    output[:class] = [output[:class], class_name].compact.join(' ')
    output
  end
end
