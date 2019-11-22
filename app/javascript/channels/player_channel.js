import consumer from './consumer'
import Peer from 'simple-peer'
import _ from 'lodash'

const playerChannel = consumer.subscriptions.create('PlayerChannel', {
  
  // SETTINGS:
  
  participants:  [],
  playerId:      null,      // Needs to be set before anything is broadcasted
  connectionId:  null,      // Wil be set on connection
  broadcastRate: 1000 / 30, // 30 FPS
  
  // CONNECTION:
  
  // Called when the subscription is ready for use on the server
  connected () {
    this.connectionId = this.generateConnectionIdentifier()
    
    this.attemptP2PConnection = this.attemptP2PConnection.bind(this)
    _.defer(this.attemptP2PConnection)
  },
  
  // Called when the subscription has been terminated by the server
  disconnected () {
    this.disconnectP2P()
  },
  
  // Called when there's incoming data on the websocket for this channel
  received (message) {
    console.log('received', message)
    let { playerId, connectionId, data } = message
    
    if (connectionId != this.connectionId) {
      const method = `receive${data[0]}`
      if (this[method]) {
        let args = data.slice(1)
        this[method].apply(this, ...args)
      }
    }
  },
  
  // P2P:
  
  disconnectP2P () {
    for (let [playerId, connectionId, peer] of this.participants) {
      peer.destroy()
    }
  },
  
  attemptP2PConnection () {
    if (this.playerId) {
      this.announceP2PAvailability()
    } else {
      _.delay(this.attemptP2PConnection, 100)
    }
  },
  
  announceP2PAvailability () {
    this.sendPeerParticipant()
  },
  
  connectToPeer (playerId, connectionId) {
    if (connectionId == this.connectionId) return
    
    if (!this.getPeerForConnection(connectionId)) {
      const init = [connectionId, this.connectionId].sort()[0] == this.connectionId
      const peer = new Peer({ initiator: init, stream: this.stream })
      
      peer.on('signal',  (signal) => this.broadcastP2PSignal(connectionId, signal))
      peer.on('stream',  (stream) => this.receiveP2PStream(playerId, connectionId, stream))
      peer.on('close',   () => this.disconnectedFromPeer(connectionId))
      
      // peer.on('data',    (d) => console.log(`Received: ${d}`))
      peer.on('connect', ()  => peer.send(`Connected ${this.connectionId} to ${connectionId}`))
      
      this.announceP2PAvailability()
      
      this.participants.push([playerId, connectionId, peer])
    }
  },
  
  disconnectedFromPeer (connectionId) {
    let index = this.participants.findIndex(
      ([pId, sId, peer]) => sId == connectionId
    )
    
    if (index) {
      let playerId = this.participants[index][0]
      this.participants = this.participants.splice(index, 1)
    }
  },
  
  disconnectPeer (connectionId) {
    const peer = this.getPeerForConnection(connectionId)
    if (peer) peer.destroy()
  },
  
  stopP2PStream (stream) {
    this.stream = null
    
    for (let [playerId, connectionId, peer] of this.participants) {
      try {
        peer.removeStream(stream)
      } catch (error) {
      }
    }
  },
  
  startP2PStream (stream) {
    this.stream = stream
    
    for (let [playerId, connectionId, peer] of this.participants) {
      peer.addStream(stream)
    }
  },
  
  // SENDERS:
  
  broadcastP2PSignal (connectionId, signal) {
    this.perform('broadcast', {
      playerId:  this.playerId,
      connectionId: this.connectionId,
      data:      [
        'P2PSignal', [{
          from:   this.connectionId,
          to:     connectionId,
          signal: JSON.stringify(signal)
        }]
      ]
    })
  },
  
  broadcast (method, ...args) {
    if (this.playerId) {
      this.perform('broadcast', {
        playerId:  this.playerId,
        connectionId: this.connectionId,
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
  
  sendCursorAttached (type, id) {
    this.broadcast('CursorAttached', this.playerId, type, id)
  },
  
  sendCursorDetached (type, id) {
    this.broadcast('CursorDetached', this.playerId, type, id)
  },
  
  sendCursorPosition (x, y) {
    // this.broadcast('CursorPosition', this.playerId, x, y)
  },
  
  sendPeerParticipant () {
    this.broadcast('PeerParticipant', this.playerId, this.connectionId)
  },
  
  // RECEIVERS:
  
  receiveChatMessage (attributes) {
    const chat = this.getTextChat()
    if (chat) chat.addMessage(attributes)
  },
  
  receiveCharacterDimensions (characterId, width, height) {
    let character = this.getCharacter(characterId)
    if (character) character.updateDimensions(width, height)
  },
  
  receiveCharacterPosition (characterId, x, y) {
    let character = this.getCharacter(characterId)
    if (character) character.updatePosition(x, y)
  },
  
  receiveCursorAttached (playerId, type, id) {
    let cursor = this.getCursor(playerId)
    let object = this.getObject(type, id)
    
    if (cursor && object) cursor.attach(object)
  },
  
  receiveCursorDetached (playerId, type, id) {
    let cursor = this.getCursor(playerId)
    let object = this.getObject(type, id)
    
    if (cursor && object) cursor.detach(object)
  },
  
  receiveCursorPosition (playerId, x, y) {
    let cursor = this.getCursor(playerId)
    if (cursor) cursor.updatePosition(x, y)
  },
  
  receiveDoorUpdated (attributes) {
    let door = this.getDoor(attributes.id)
    if (door) door.load(attributes)
  },
  
  receiveP2PSignal (data = {}) {
    const { from, to, signal } = data
    
    if (to == this.connectionId) {
      const peer = this.getPeerForConnection(from)
      if (peer) peer.signal(signal)
    }
  },
  
  receiveP2PStream (playerId, connectionId, stream) {
    const chat = this.getVideoChat()
    if (chat) chat.addStream(playerId, stream)
  },
  
  receivePeerParticipant (playerId, connectionId) {
    this.connectToPeer(playerId, connectionId)
    
    const chat = this.getVideoChat()
    if (chat) chat.setParticipantStatus(playerId, 'online')
  },
  
  // HELPERS:
  
  getObject (type, id) {
    const method = `get${type}`
    if (this[method]) return this[method](id)
    return null
  },
  
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
  
  getDoor (doorId) {
    let element = document.querySelector(
      `[data-controller="map--door"][data-map--door-id="${doorId}"]`
    )
    
    if (element && this.application) {
      return this.application
                 .getControllerForElementAndIdentifier(element, 'map--door')
    }
  },
  
  getPeersForPlayer (playerId) {
    this.participants.filter(
      ([pId, sId, peer]) => pId == playerId
    ).map(
      ([pId, sId, peer]) => peer
    )
  },
  
  getPeerForConnection (connectionId) {
    const participant = this.participants.find(
      ([pId, sId, peer]) => sId == connectionId
    )
    
    if (participant) {
      const [playerId, connectionId, peer] = participant
      return peer
    }
  },
  
  getVideoChat () {
    let element = document.querySelector('[data-controller="video-chat"]')
    
    if (element && this.application) {
      return this.application
                 .getControllerForElementAndIdentifier(element, 'video-chat')
    }
  },
  
  getTextChat () {
    let element = document.querySelector('[data-controller="text-chat"]')
    
    if (element && this.application) {
      return this.application
                 .getControllerForElementAndIdentifier(element, 'text-chat')
    }
  },
  
  // Generate a random string that allows us to filter out messages that we
  // broadcasted. This way we can avoid processing data that we modified
  // ourselves.
  generateConnectionIdentifier () {
    return [
      new Date().getTime(),
      Math.random() * 1000000
    ].map((number) => number.toString(36)).join('+')
  }
});

export default playerChannel
