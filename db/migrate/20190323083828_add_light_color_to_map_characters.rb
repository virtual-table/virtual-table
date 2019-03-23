class AddLightColorToMapCharacters < ActiveRecord::Migration[6.0]
  def change
    add_column :map_characters, :light_color, :string, default: '#fffcbb'
  end
end
