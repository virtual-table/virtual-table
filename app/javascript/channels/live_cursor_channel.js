import consumer from "./consumer"

const liveCursorChannel = consumer.subscriptions.create("LiveCursorChannel", {
  connected() {
    console.log('liveCursorChannel connected')
    // Called when the subscription is ready for use on the server
  },
  
  // Called when the subscription has been terminated by the server
  disconnected() {
    console.log('liveCursorChannel disconnected')
  },
  
  // Called when there's incoming data on the websocket for this channel
  received(data) {
    let element = document.querySelector(`[data-controller="map--cursor"][data-map--cursor-user-id="${data.user.id}"]`)
    if (element) {
      element.dataset['map-CursorX'] = data.position[0]
      element.dataset['map-CursorY'] = data.position[1]
      element.dataset['map-Floor']   = data.floor
      event = new Event('locationUpdated')
      element.dispatchEvent(event)
    }
  },
  
  sendPosition (gameId, floor, position) {
    this.perform('update_position', {
      game_id:  gameId,
      floor:    floor,
      position: [position.x, position.y]
    })
  }
});

export default liveCursorChannel
