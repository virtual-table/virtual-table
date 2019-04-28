class AddBoundsToMapRooms < ActiveRecord::Migration[6.0]
  def change
    add_column :map_rooms, :bounds, :json
    
    Map::Room.find_each do |room|
      walls  = Map::Wall.where(room_id: room.id).all
      
      points = []
      walls.each do |wall|
        points += wall.path
      end
      points = points.uniq
      
      left   = points.map { |p| p[0] }.min
      right  = points.map { |p| p[0] }.max
      top    = points.map { |p| p[1] }.min
      bottom = points.map { |p| p[1] }.max
      
      puts "#{room.short_code} #{room.title} #{left}, #{top} -> #{right}, #{bottom}"
      
      room.update_column :bounds, [
        [left, top   ], [right, top   ],
        [left, bottom], [right, bottom]
      ]
    end
  end
end
