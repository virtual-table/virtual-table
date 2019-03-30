class Map::CharacterChannel < ApplicationCable::Channel
  def subscribed
    current_user.games.each do |game|
      stream_for [game, :character]
    end
  end
  
  def unsubscribed
    stop_all_streams
  end
  
  def update_position_and_dimensions(data)
    character = Map::Character.find(data['character_id'].to_i)
    
    if game = current_user.games.find { |game| game == character.game }
      broadcast_to([game, :character], data)
    end
  end
end
