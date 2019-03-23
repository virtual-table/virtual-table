class AddGlobalIlluminationToMapFloors < ActiveRecord::Migration[6.0]
  def change
    add_column :map_floors, :global_illumination, :boolean, default: true
  end
end
