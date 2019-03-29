import consumer from "./consumer"

const liveCursorChannel = consumer.subscriptions.create("LiveCursorChannel", {
  connected() {
    console.log('liveCursorChannel connected')
    // Called when the subscription is ready for use on the server
  },
  
  disconnected() {
    console.log('liveCursorChannel disconnected')
    // Called when the subscription has been terminated by the server
  },
  
  received(data) {
    console.log('liveCursorChannel received', data)
    // Called when there's incoming data on the websocket for this channel
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
