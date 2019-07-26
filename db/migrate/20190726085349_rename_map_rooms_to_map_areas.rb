class RenameMapRoomsToMapAreas < ActiveRecord::Migration[6.0]
  def center_of_bounds(bounds)
    x_points = bounds.map &:first
    y_points = bounds.map &:second
    
    x_sum = x_points.sum
    y_sum = y_points.sum
    
    {
      x: x_sum / x_points.size,
      y: y_sum / y_points.size
    }
  end
  
  def change
    rename_table :map_rooms, :map_areas
    
    add_column :map_areas, :x, :integer, null: false, default: 0
    add_column :map_areas, :y, :integer, null: false, default: 0
    add_column :map_areas, :z, :integer, null: false, default: 0
    
    Map::Area.find_each do |area|
      area.update_columns center_of_bounds(area.bounds) if area.bounds.present?
    end
  end
end
