class RemovePageRoomPage < ActiveRecord::Migration[6.0]
  def change
    Page.where(type: 'Page::RoomPage').update_all type: 'Page'
  end
end
