class AddPageReferenceToMapFloors < ActiveRecord::Migration[6.0]
  def change
    add_reference :map_floors, :page, foreign_key: true
    
    Map.find_each do |map|
      map.floors.each do |floor|
        parent_page = Page.find map.page_id
        compendium  = Compendium.find parent_page.compendium_id
        
        page = compendium.pages.create type: 'Page::FloorPage', parent_id: parent_page.id, title: floor.title
        floor.update_column :page_id, page.id
      end
    end
  end
end
