class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :title
      t.belongs_to :author, foreign_key: { to_table: :users }
      t.timestamps
    end
  end
end
