import consumer from "../consumer"

const characterChannel = consumer.subscriptions.create("Map::CharacterChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },
  
  disconnected() {
    // Called when the subscription has been terminated by the server
  },
  
  received (data) {
    // Called when there's incoming data on the websocket for this channel
    console.log('characterChannel received', data)
    
    let element = document.querySelector(
      `[data-controller="map--character"][data-map--character-id="${data.character_id}"]`
    )
    
    if (element && this.application) {
      let character = this.application.getControllerForElementAndIdentifier(element, 'map--character')
      if (!character) return
      
      // TODO: Add some way to NOT update settings for person making the changes.
      // Using the !character.dragging is a hack.
      if (!character.dragging) {
        character.x = data.position[0]
        character.y = data.position[1]
      }
    }
  },
  
  sendPositionAndDimensions (characterId, data) {
    this.perform('update_position_and_dimensions', {
      character_id: characterId,
      width:        data.width,
      height:       data.height,
      position:     [data.x, data.y]
    })
  }
});

export default characterChannel
