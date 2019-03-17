class AddObstaclesToMapFloors < ActiveRecord::Migration[6.0]
  def change
    add_column :map_floors, :obstacles, :json, default: []
  end
end
