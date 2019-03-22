class CreateMapRooms < ActiveRecord::Migration[6.0]
  def change
    create_table :map_rooms do |t|
      t.belongs_to :floor, index: true, foreign_key: { to_table: :map_floors }
      t.string :short_code
      t.string :title
      t.timestamps
    end
  end
end
