class AddGridTypeToMapFloors < ActiveRecord::Migration[6.0]
  def change
    add_column :map_floors, :grid_type, :string, default: 'square'
  end
end
