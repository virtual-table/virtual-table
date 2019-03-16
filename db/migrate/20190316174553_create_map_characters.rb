class CreateMapCharacters < ActiveRecord::Migration[6.0]
  def change
    create_table :map_characters do |t|
      t.string  :name
      t.belongs_to :floor, index: true, foreign_key: { to_table: :map_floors }
      t.boolean :visible,  default: true
      t.integer :width
      t.integer :height
      t.integer :x,                   default: 0
      t.integer :y,                   default: 0
      t.integer :z,                   default: 0
      t.integer :light_radius,        default: 20
      t.integer :dim_light_radius,    default: 40
      t.integer :light_angle,         default: 360
      t.integer :line_of_sight_angle, default: 0
      t.timestamps
    end
  end
end
