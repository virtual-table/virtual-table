require 'localeapp/rails'

Localeapp.configure do |config|
  config.api_key = 'ZNWQXdhmrd5dtHezZpGy9GadPcz9qOGVkhTV0FiUJVN1XD2yVK'
  
  # Disable polling:
  config.polling_environments = []
end

# Pull latest when app restarts in production:
Localeapp::CLI::Pull.new.execute if defined?(Rails) && Rails.env.production?
