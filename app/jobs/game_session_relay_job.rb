class GameSessionRelayJob < ApplicationJob
  queue_as :default
  
  def perform(session, player: nil, connection_id: nil, **data)
    session.players.each do |player|
      PlayerChannel.broadcast_to(
        player,
        data.merge(
          playerId:     player&.id,
          connectionId: connection_id
        )
      )
    end
  end
end
