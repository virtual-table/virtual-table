class GameInvitationsController < ApplicationController


  before_action :require_user, only: %i[join create]

  before_action :load_game, only: %i[create show edit]

  before_action :check_user_is_author?, only: %i[create]

  def show
  end
  
  #user joins the game
  def edit 
    @current_user ||= User.find(cookies.encrypted[:user_id]) if cookies.encrypted[:user_id]
    if !!current_user
      # Add player to game and redirect to game
      if self.join(@game.id, @game.invite_code)
        
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
    
      # Cleanup cookies here?
      cookies.delete(:game_invite_code)
      cookies.delete(:game_invite_id)
      success = true
    else
      success = false
      
    end
  end

  #create a new invitation link
  def create
    #raise 'hoi'
    @game.generate_invite_code
    redirect_to @game
  end

  private

  def load_game
    @game = Game.find params[:id]
  end

  def check_user_is_author?
    @game.author == @current_user
  end


end
