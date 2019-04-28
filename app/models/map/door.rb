class Map::Door < ApplicationRecord
  
  belongs_to :floor
  
  delegate :map, to: :floor,
    allow_nil: true
    
  delegate :compendium, to: :floor,
    allow_nil: true
  
  after_save :relay_update
  
  def origin
    [origin_x, origin_y]
  end
  
  def origin=(v)
    self.origin_x = v.first
    self.origin_y = v.last
  end
  
  def destination
    [destination_x, destination_y]
  end
  
  def destination=(v)
    self.destination_x = v.first
    self.destination_y = v.last
  end
  
  private
  
  def relay_update
    return unless compendium.present?
    
    compendium.games.each do |game|
      GameRelayJob.perform_later(game, data: ['DoorUpdated', [attributes]])
    end
  end
  
end
