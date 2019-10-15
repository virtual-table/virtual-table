module Playable
  extend ActiveSupport::Concern
  
  included do
    helper_method :current_game
    helper_method :current_player
  end
  
  def current_game
    @game
  end
  
  def current_player
    return unless logged_in?
    
    @current_player ||= current_game&.players&.find do |player|
      player.user_id == current_user.id
    end
  end
  

  def require_player
    if !current_player
      flash[:alert] = t('.player_required')
      redirect_to games_url
      return false
    end
    
    true
  end

  def require_gm
    return false unless require_user
    unless current_player.role.include?('gm') || @game.author.include?(current_user)
      flash[:alert] = t('.gm_reqiured')
      redirect_to login_url
      return false
    end
  end
end
