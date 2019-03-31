class ApplicationController < ActionController::Base
  include Authentication
  
  private
  
  def current_game
    @game
  end
  helper_method :current_game
  
  def current_player
    @current_player ||= logged_in? && current_game&.players&.find { |player| player.user_id == current_user.id }
  end
  helper_method :current_player
end
