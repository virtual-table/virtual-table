module Games
  class ChatMessagesController < ApplicationController
    
    before_action :load_game
    
    before_action :require_player
    
    before_action :load_session
    
    def create
      @message = @session.chat_messages.build message_params
      @message.author = current_user
      
      if @message.save
        respond_to do |format|
          format.html { redirect_to game_play_url(@game, @session) }
          format.js   { render :create                     }
        end
      else
        respond_to do |format|
          format.html { render :new }
          format.js   { render :new }
        end
      end
    end
    
    private
    
    def load_game
      @game = Game.find params[:game_id]
    end
    
    def load_session
      @session = @game.sessions.find params[:session_id]
    end
    
    def message_params
      params.require(:chat_message).permit(%i[
        body
      ])
    end
  end
end
