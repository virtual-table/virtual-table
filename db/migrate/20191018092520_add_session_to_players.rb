class AddSessionToPlayers < ActiveRecord::Migration[6.0]
  def change
    add_reference :players, :session, null: true, foreign_key: { to_table: 'game_sessions' }
  end
end
