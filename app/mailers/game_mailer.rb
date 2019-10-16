class GameMailer < ApplicationMailer
  def game_player_joined
    # A player joined your game
  end

  def send_invite(email, game)
    @game = game
    mail to: email, subject: t('.game_invite.subject')
  end
end
