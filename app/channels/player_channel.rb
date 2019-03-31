class PlayerChannel < ApplicationCable::Channel
  def subscribed
    current_user.players.each do |player|
      stream_for [player]
    end
  end
  
  def unsubscribed
    stop_all_streams
  end
  
  def broadcast(message)
    current_player = Player.find(message['playerId'])
    other_players  = current_player.game.players
    other_players.each do |player|
      broadcast_to player, message
    end
  end
end
