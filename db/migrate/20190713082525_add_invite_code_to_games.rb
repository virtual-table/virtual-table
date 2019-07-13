class AddInviteCodeToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :invite_code, :string
    
    Game.find_each do |game|
      game.update_column :invite_code, SecureRandom.urlsafe_base64
    end
  end
end
