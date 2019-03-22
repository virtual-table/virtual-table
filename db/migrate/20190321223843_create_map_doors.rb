class CreateMapDoors < ActiveRecord::Migration[6.0]
  def change
    create_table :map_doors do |t|
      t.belongs_to :room, index: true, foreign_key: { to_table: :map_rooms }
      t.integer :origin_x
      t.integer :origin_y
      t.integer :destination_x
      t.integer :destination_y
      t.boolean :closed, default: true
      t.timestamps
    end
  end
end
