autoloader = Rails.autoloaders.main

Dir[Rails.root.join('app', 'models', 'content', '**', '*.rb')].each do |path|
  autoloader.preload path
end
