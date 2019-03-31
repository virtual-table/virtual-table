import consumer from "./consumer"

const playerChannel = consumer.subscriptions.create("PlayerChannel", {
  
  // SETTINGS:
  
  playerId:      null, // needs to be set before anything is broadcasted
  broadcastRate: 1000 / 30, // 30 FPS
  
  // CONNECTION:
  
  // Called when the subscription is ready for use on the server
  connected() {
    this.sessionId = this.generateSessionIdentifier()
    console.log('PlayerChannel connected', this)
  },
  
  // Called when the subscription has been terminated by the server
  disconnected() {
    console.log('PlayerChannel disconnected')
  },
  
  // Called when there's incoming data on the websocket for this channel
  received(message) {
    let { playerId, sessionId, data } = message
    if (sessionId != this.sessionId) {
      const method = `receive${data[0]}`
      if (this[method]) this[method].apply(this, ...data.slice(1))
    }
  },
  
  // SENDERS:
  
  broadcast (method, ...args) {
    if (this.playerId) {
      this.perform('broadcast', {
        playerId:  this.playerId,
        sessionId: this.sessionId,
        data:      [method, args]
      })
    }
  },
  
  sendCharacterDimensions (characterId, width, height) {
    this.broadcast('CharacterDimensions', characterId, width, height)
  },
  
  sendCharacterPosition (characterId, x, y) {
    this.broadcast('CharacterPosition', characterId, x, y)
  },
  
  sendCursorPosition (x, y) {
    this.broadcast('CursorPosition', this.playerId, x, y)
  },
  
  // RECEIVERS:
  
  receiveCharacterDimensions (characterId, width, height) {
    let character = this.getCharacter(characterId)
    if (character) character.updateDimensions(width, height)
  },
  
  receiveCharacterPosition (characterId, x, y) {
    let character = this.getCharacter(characterId)
    if (character) character.updatePosition(x, y)
  },
  
  receiveCursorPosition (playerId, x, y) {
    let cursor = this.getCursor(playerId)
    if (cursor) cursor.updatePosition(x, y)
  },
  
  // HELPERS:
  
  getCharacter (characterId) {
    let element = document.querySelector(
      `[data-controller="map--character"][data-map--character-id="${characterId}"]`
    )
    
    if (element && this.application) {
      return this.application
                 .getControllerForElementAndIdentifier(element, 'map--character')
    }
  },
  
  getCursor (playerId) {
    let element = document.querySelector(
      `[data-controller="map--cursor"][data-map--cursor-player-id="${playerId}"]`
    )
    
    if (element && this.application) {
      return this.application
                 .getControllerForElementAndIdentifier(element, 'map--cursor')
    }
  },
  
  // Generate a random string that allows us to filter out messages that we
  // broadcasted. This way we can avoid processing data that we modified
  // ourselves.
  generateSessionIdentifier () {
    return [
      new Date().getTime(),
      Math.random() * 1000000
    ].map((number) => number.toString(36)).join('+')
  }
});

export default playerChannel
