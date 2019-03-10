class CreateMapFloors < ActiveRecord::Migration[6.0]
  def change
    create_table :map_floors do |t|
      t.belongs_to :map,              index: true, foreign_key: true
      t.string     :title
      t.integer    :columns,          default: 30
      t.integer    :rows,             default: 24
      t.integer    :scale,            default: 5
      t.integer    :scale_unit,       default: 'ft'
      t.string     :background_color, default: '#ffffff'
      t.boolean    :grid,             default: true
      t.string     :grid_color,       default: '#c0c0c0'
      t.float      :grid_opacity,     default: 0.5
      t.timestamps
    end
  end
end
