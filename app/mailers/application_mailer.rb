class ApplicationMailer < ActionMailer::Base
  
  default from: Settings.email
  
  default_url_options.merge! host: URI.parse(Settings.root_url).host
  
  layout 'mailer'
  
end
