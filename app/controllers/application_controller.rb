class ApplicationController < ActionController::Base
  include Authenticatable
  include GracefulLocaleapp
  include Playable
end
