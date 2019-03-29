class LiveCursorChannel < ApplicationCable::Channel
  def subscribed
    current_user.games.each do |game|
      stream_for game
    end
  end
  
  def unsubscribed
    stop_all_streams
  end
  
  def update_position(data)
    game_id = data['game_id'].to_i
    if game = current_user.games.find { |game| game.id == game_id }
      broadcast_to(game, data.merge('user' => {
        'id'   => current_user.id,
        'name' => current_user.name
      }))
    end
  end
end
