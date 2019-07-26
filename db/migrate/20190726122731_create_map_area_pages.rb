class CreateMapAreaPages < ActiveRecord::Migration[6.0]
  def change
    create_table :map_area_pages do |t|
      t.belongs_to :area, index: true, foreign_key: { to_table: :map_areas }
      t.belongs_to :page, index: true
      t.timestamps
    end
    
    Map::Area.pluck(:id, :page_id).each do |pair|
      area_id = pair.first
      page_id = pair.second
      
      if Page.where(id: page_id).exists?
        puts "Linking page #{page_id} to area #{area_id}"
        Map::AreaPage.create(
          page_id: page_id,
          area_id: area_id
        )
      end
    end
    
    remove_column :map_areas, :page_id, :integer
  end
end
