module Games
  class InvitesController < ApplicationController
    
    before_action :load_game
    
    before_action :require_gm, only: %i[destroy]
    
    def update
      if @game.invite_code == invite_code_param
        if logged_in?
          current_user.join! @game
          redirect_to @game
        else
          add_pending_game_invite @game
          redirect_to login_url, alert: t('.user_account_required')
        end
      else
        redirect_to root_url, alert: t('.invite_code_invalid')
      end
    end
    
    def destroy
      @game.generate_invite_code!
      redirect_to @game
    end
    
    private
    
    def invite_code_param
      params[:code]
    end
    
    def load_game
      @game = Game.find params[:id]
    end
  end
end
