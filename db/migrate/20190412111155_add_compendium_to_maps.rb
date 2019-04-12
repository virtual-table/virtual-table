class AddCompendiumToMaps < ActiveRecord::Migration[6.0]
  def change
    add_reference :maps, :compendium, foreign_key: true
    Map.find_each do |map|
      compendium_id = map.page&.compendium_id
      map.update_column :compendium_id, compendium_id
    end
  end
end
