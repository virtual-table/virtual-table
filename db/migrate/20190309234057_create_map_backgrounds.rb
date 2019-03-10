class CreateMapBackgrounds < ActiveRecord::Migration[6.0]
  def change
    create_table :map_backgrounds do |t|
      t.belongs_to :floor, index: true, foreign_key: { to_table: :map_floors }
      t.boolean :visible,  default: true
      t.integer :width
      t.integer :height
      t.integer :x,        default: 0
      t.integer :y,        default: 0
      t.integer :z,        default: 0
      t.timestamps
    end
  end
end
