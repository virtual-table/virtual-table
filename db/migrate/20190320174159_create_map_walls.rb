class CreateMapWalls < ActiveRecord::Migration[6.0]
  def change
    create_table :map_walls do |t|
      t.belongs_to :room, index: true, foreign_key: { to_table: :map_rooms }
      t.integer :origin_x
      t.integer :origin_y
      t.integer :destination_x
      t.integer :destination_y
      t.timestamps
    end
  end
end
