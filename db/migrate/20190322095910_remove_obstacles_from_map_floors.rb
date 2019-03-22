class RemoveObstaclesFromMapFloors < ActiveRecord::Migration[6.0]
  def change
    remove_column :map_floors, :obstacles
  end
end
