import consumer from './consumer'
import Peer from 'simple-peer'
import _ from 'lodash'

const playerChannel = consumer.subscriptions.create('PlayerChannel', {
  
  // SETTINGS:
  
  participants:  [],
  playerId:      null,      // Needs to be set before anything is broadcasted
  sessionId:     null,      // Wil be set on connection
  broadcastRate: 1000 / 30, // 30 FPS
  
  // CONNECTION:
  
  // Called when the subscription is ready for use on the server
  connected () {
    this.sessionId = this.generateSessionIdentifier()
    
    this.attemptP2PConnection = this.attemptP2PConnection.bind(this)
    _.defer(this.attemptP2PConnection)
  },
  
  // Called when the subscription has been terminated by the server
  disconnected () {
    this.disconnectP2P()
  },
  
  // Called when there's incoming data on the websocket for this channel
  received (message) {
    let { playerId, sessionId, data } = message
    
    if (sessionId != this.sessionId) {
      const method = `receive${data[0]}`
      if (this[method]) {
        let args = data.slice(1)
        this[method].apply(this, ...args)
      }
    }
  },
  
  // P2P:
  
  disconnectP2P () {
    for (let [playerId, sessionId, peer] of this.participants) {
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
  
  connectToPeer (playerId, sessionId) {
    if (sessionId == this.sessionId) return
    
    if (!this.getPeerForSession(sessionId)) {
      const init = [sessionId, this.sessionId].sort()[0] == this.sessionId
      const peer = new Peer({ initiator: init, stream: this.stream })
      
      peer.on('signal',  (signal) => this.broadcastP2PSignal(sessionId, signal))
      peer.on('stream',  (stream) => this.receiveP2PStream(playerId, sessionId, stream))
      peer.on('close',   () => this.disconnectedFromPeer(sessionId))
      
      // peer.on('data',    (d) => console.log(`Received: ${d}`))
      peer.on('connect', ()  => peer.send(`Connected ${this.sessionId} to ${sessionId}`))
      
      this.announceP2PAvailability()
      
      this.participants.push([playerId, sessionId, peer])
    }
  },
  
  disconnectedFromPeer (sessionId) {
    let index = this.participants.findIndex(
      ([pId, sId, peer]) => sId == sessionId
    )
    
    if (index) {
      let playerId = this.participants[index][0]
      this.participants = this.participants.splice(index, 1)
    }
  },
  
  disconnectPeer (sessionId) {
    const peer = this.getPeerForSession(sessionId)
    if (peer) peer.destroy()
  },
  
  stopP2PStream (stream) {
    this.stream = null
    
    for (let [playerId, sessionId, peer] of this.participants) {
      try {
        peer.removeStream(stream)
      } catch (error) {
      }
    }
  },
  
  startP2PStream (stream) {
    this.stream = stream
    
    for (let [playerId, sessionId, peer] of this.participants) {
      peer.addStream(stream)
    }
  },
  
  // SENDERS:
  
  broadcastP2PSignal (sessionId, signal) {
    this.perform('broadcast', {
      playerId:  this.playerId,
      sessionId: this.sessionId,
      data:      [
        'P2PSignal', [{
          from:   this.sessionId,
          to:     sessionId,
          signal: JSON.stringify(signal)
        }]
      ]
    })
  },
  
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
  
  sendCursorAttached (type, id) {
    this.broadcast('CursorAttached', this.playerId, type, id)
  },
  
  sendCursorDetached (type, id) {
    this.broadcast('CursorDetached', this.playerId, type, id)
  },
  
  sendCursorPosition (x, y) {
    this.broadcast('CursorPosition', this.playerId, x, y)
  },
  
  sendPeerParticipant () {
    this.broadcast('PeerParticipant', this.playerId, this.sessionId)
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
    
    if (to == this.sessionId) {
      const peer = this.getPeerForSession(from)
      if (peer) peer.signal(signal)
    }
  },
  
  receiveP2PStream (playerId, sessionId, stream) {
    const chat = this.getVideoChat()
    if (chat) chat.addStream(playerId, stream)
  },
  
  receivePeerParticipant (playerId, sessionId) {
    this.connectToPeer(playerId, sessionId)
    
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
  
  getPeerForSession (sessionId) {
    const participant = this.participants.find(
      ([pId, sId, peer]) => sId == sessionId
    )
    
    if (participant) {
      const [playerId, sessionId, peer] = participant
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
