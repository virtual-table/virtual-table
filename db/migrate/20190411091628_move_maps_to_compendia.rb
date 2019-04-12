class MoveMapsToCompendia < ActiveRecord::Migration[6.0]
  def change
    add_belongs_to :maps, :page, foreign_key: true
    
    Map.find_each do |map|
      game = Game.find map.game_id
      user = User.find game.author_id
      
      compendium  = user.compendia.find_or_create_by!   title: game.title
      parent_page = compendium.pages.find_or_create_by! title: 'Maps'
      
      page = compendium.pages.create!(
        type:      'Page::MapPage',
        title:     map.title,
        parent_id: parent_page.id
      )
      
      map.update_column :page_id, page.id
    end
    
    remove_belongs_to :maps, :game
  end
end
