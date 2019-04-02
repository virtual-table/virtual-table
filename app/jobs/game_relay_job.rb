class GameRelayJob < ApplicationJob
  queue_as :default
  
  def perform(game, player: nil, session_id: nil, **data)
    game.players.each do |player|
      PlayerChannel.broadcast_to(
        player,
        data.merge(
          playerId:  player&.id,
          sessionId: session_id
        )
      )
    end
  end
end
