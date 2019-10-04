source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.5'

# Rake:
gem 'rake'

# Rails:
gem 'rails',    '~> 6.0.0.rc2'
gem 'bootsnap', '>= 1.1.0', require: false

# Database:
gem 'pg'
gem 'redis'

# Utility:
gem 'bcrypt'
gem 'dotenv'

# File handling:
gem 'aws-sdk-s3', require: false
gem 'image_processing'

# I18n:
gem 'localeapp'

# Frontend:
gem 'webpacker'
gem 'sass-rails'
gem 'turbolinks'

# Background:
gem 'daemons'
gem 'delayed_job_active_record'

# Web Server:
gem 'puma'

# RPG:
gem 'dicebag'

# Admin:
gem 'activeadmin'
gem 'ransack', git: 'https://github.com/activerecord-hackery/ransack.git', branch: 'master'

# Error handling:
gem 'appsignal'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  
  %w[
    rspec-core
    rspec-expectations
    rspec-mocks
    rspec-rails
    rspec-support
  ].each do |lib|
    gem lib, git: "https://github.com/rspec/#{lib}.git", branch: 'master'
  end
  gem 'action-cable-testing'
  gem 'factory_bot_rails'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'mailcatcher'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  gem 'chromedriver-helper'
  gem 'ffaker'
  gem 'shoulda-matchers'
end
