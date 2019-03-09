class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.belongs_to :game, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.string :role
      t.timestamps
    end
    
    Game.find_each do |game|
      Player.create game_id: game.id,
                    user_id: game.author_id,
                    role:    'gm'
    end
  end
end
