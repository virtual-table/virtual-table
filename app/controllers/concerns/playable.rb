module Playable
  extend ActiveSupport::Concern

  included do
    after_action :join_invited_games, if: :logged_in?

    helper_method :current_game
    helper_method :current_player
  end

  private

  def add_pending_game_invite(game)
    cookies[:game_invite_id]   = game.id
    cookies[:game_invite_code] = game.invite_code
  end

  def pending_game_invites
    if cookies[:game_invite_id].present?
      {
        cookies[:game_invite_id] => cookies[:game_invite_code]
      }
    else
      {
      }
    end
  end

  def clear_pending_game_invites
    cookies.delete :game_invite_id
    cookies.delete :game_invite_code
  end

  def join_invited_games
    if pending_game_invites.present?
      pending_game_invites.each { |id, code| join_invited_game(id, code) }
      clear_pending_game_invites
    end
  end

  def join_invited_game(game_id, invite_code)
    game = Game.find_by id: game_id

    if game && game.invite_code == invite_code
      current_user.join!(game)
    end
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
  
    return if current_player.role.include?('gm') || @game.author == current_user

    flash[:alert] = t('.gm_reqiured')
    redirect_to login_url
    return false
  end

  def require_player_in_game
    return if current_user.players.any? { |player| current_game.include? player }

    flash[:alert] = t('.player_reqiured')
    redirect_to login_url
    return false
  end
end
