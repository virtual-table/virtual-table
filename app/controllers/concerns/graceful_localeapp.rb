module GracefulLocaleapp
  extend ActiveSupport::Concern
  
  def handle_translation_updates
    begin
      super
    rescue RestClient::TooManyRequests => e
    end
  end
  
  def send_missing_translations
    begin
      super
    rescue RestClient::TooManyRequests => e
    end
  end
end
