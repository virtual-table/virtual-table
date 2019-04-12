class AddPageReferenceToMapRooms < ActiveRecord::Migration[6.0]
  def change
    add_reference :map_rooms, :page, foreign_key: true
    
    Map::Room.find_each do |room|
      floor = room.floor
      
      parent_page = Page.find floor.page_id
      compendium  = Compendium.find parent_page.compendium_id
      
      title = [room.short_code, room.title].compact.join('. ')
      page  = compendium.pages.create type: 'Page::RoomPage', parent_id: parent_page.id, title: title
      room.update_column :page_id, page.id
    end
  end
end
