source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.1'

# Rails:
gem 'rails',    '~> 6.0.0.beta2'
gem 'bootsnap', '>= 1.1.0', require: false
gem 'puma'

# Database:
gem 'pg'

# Utility:
gem 'bcrypt'

# File handling:
gem 'aws-sdk-s3', require: false
gem 'image_processing'

# Frontend:
gem 'sass-rails'
gem 'webpacker'
gem 'turbolinks'

# Background:
gem 'delayed_job_active_record'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  gem 'chromedriver-helper'
end
