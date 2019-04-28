class MoveWallsAndDoorsToFloors < ActiveRecord::Migration[6.0]
  def change
    add_belongs_to :map_walls, :floor, foreign_key: { to_table: :map_floors }, index: true
    add_belongs_to :map_doors, :floor, foreign_key: { to_table: :map_floors }, index: true
    
    Map::Wall.find_each do |wall|
      room = Map::Room.find(wall.room_id)
      wall.update_column :floor_id, room.floor_id
    end
    
    Map::Door.find_each do |door|
      room = Map::Room.find(door.room_id)
      door.update_column :floor_id, room.floor_id
    end
    
    remove_belongs_to :map_walls, :room
    remove_belongs_to :map_doors, :room
  end
end
