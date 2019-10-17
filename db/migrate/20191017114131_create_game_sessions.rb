class CreateGameSessions < ActiveRecord::Migration[6.0]
  def change
    create_table :game_sessions do |t|
      t.belongs_to :author, null: false, foreign_key: { to_table: 'users' }, index: { name: 'game_session_author' }
      t.belongs_to :game,   null: false, foreign_key: { to_table: 'games' }, index: { name: 'game_session_game' }
      t.text       :subject
      t.string     :mode
      t.belongs_to :current_context, null: true, polymorphic: true, index: { name: 'game_session_context' }
      t.belongs_to :current_map,     null: true, foreign_key: { to_table: 'maps' }, index: { name: 'game_session_map' }
      t.timestamps
    end
    
    Game.find_each do |game|
      GameSession.create(
        author_id:      game.author_id,
        game_id:        game.id,
        subject:        'Session #1',
        current_map_id: game.maps.first&.id
      )
    end
  end
end
