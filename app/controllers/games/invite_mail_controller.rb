module Games
  class InviteMailController < ApplicationController
    
    before_action :load_game
    
    before_action :require_gm
    
    def create
      GameMailer.send_invite(params[:email], @game).deliver_now
      redirect_to @game, success: t('.game_invite_email_send')
    end
    
    private
    
    def load_game
      @game = Game.find params[:id]
    end
  end
end
