class CreateGameCompendia < ActiveRecord::Migration[6.0]
  def change
    create_table :game_compendia do |t|
      t.belongs_to :game,       foreign_key: true, null: false
      t.belongs_to :compendium, foreign_key: true, null: false
      t.timestamps
    end
    
    Game.find_each do |game|
      user = User.find game.author_id
      compendium = user.compendia.find_or_create_by title: game.title
      GameCompendium.create game: game, compendium: compendium
    end
  end
end
