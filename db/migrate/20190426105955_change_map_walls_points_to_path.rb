class ChangeMapWallsPointsToPath < ActiveRecord::Migration[6.0]
  def change
    add_column :map_walls, :path, :json
    
    Map::Wall.find_each do |wall|
      wall.update_column :path, [
        [wall.origin_x,      wall.origin_y],
        [wall.destination_x, wall.destination_y]
      ]
    end
    
    remove_column :map_walls, :origin_x
    remove_column :map_walls, :origin_y
    remove_column :map_walls, :destination_x
    remove_column :map_walls, :destination_y
  end
end
