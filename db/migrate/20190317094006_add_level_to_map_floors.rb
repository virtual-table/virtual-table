class AddLevelToMapFloors < ActiveRecord::Migration[6.0]
  def change
    add_column :map_floors, :level, :integer, default: 0
  end
end
