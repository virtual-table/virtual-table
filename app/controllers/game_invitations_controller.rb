class GameInvitationsController < ApplicationController


  before_action :require_user, only: %i[join create]

  before_action :load_game, only: %i[create show edit]

  before_action :require_gm, only: %i[create]

  def show
  end
  
  def edit 
    if logged_in?
      if join(@game.id, @game.invite_code)        
        redirect_to @game
      else
        redirect_to root_url, alert: t('.invite_code_invalid')
      end
    else
      cookies.encrypted[:game_invite_code] = @game.invite_code
      cookies.encrypted[:game_invite_id] = @game.id
      
      redirect_to root_url
    end
  end

  def join(id, code)
    @game = Game.find(id)
    if @game.invite_code == code
      current_user.join! @game
    
      cookies.delete(:game_invite_code)
      cookies.delete(:game_invite_id)
      success = true
    else
      success = false
      
    end
  end

  def create
    @game.generate_invite_code!
    redirect_to @game
  end

  private

  def load_game
    @game = Game.find params[:id]
  end

  def check_user_is_author
    @game.author == @current_user
  end
end
