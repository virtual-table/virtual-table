example_settings_path = Rails.root.join('config', 'application.yml.example')
actual_settings_path  = Rails.root.join('config', 'application.yml')

unless File.exists?(actual_settings_path)
  FileUtils.cp example_settings_path, actual_settings_path
end
