class ApplicationMailer < ActionMailer::Base
  
  default from: 'info@virtualtable.app'
  
  default_url_options.merge! host: 'www.virtualtable.app'
  
  layout 'mailer'
  
end
