class ApplicationController < ActionController::Base
  include Authenticatable
  include Playable
end
