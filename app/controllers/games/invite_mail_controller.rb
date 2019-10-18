module Games
  class InviteMailController < ApplicationController
    
    before_action :load_game
    
    before_action :require_gm
    
    def create
      if params[:email].present?
        GameMailer.send_invite(params[:email], @game).deliver_now
        redirect_to @game, success: t('.game_invite_email_send')
      else
        render :new
      end
    end
    
    private
    
    def load_game
      @game = Game.find params[:id]
    end
  end
end
