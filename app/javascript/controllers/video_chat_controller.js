import ApplicationController from 'controllers/application_controller'
import playerChannel from 'channels/player_channel'
import Peer from 'simple-peer'
import _ from 'underscore'

// Broadcast Types
const ADD_PARTICIPANT    = 'ADD_PARTICIPANT'
const EXCHANGE_SIGNAL    = 'EXCHANGE_SIGNAL'
const REMOVE_PARTICIPANT = 'REMOVE_PARTICIPANT'

const ice = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

export default class extends ApplicationController {
  
  static targets = ['host', 'participant']
  
  get mediaConstraints () {
    return {
      audio: true,
      video: true
    }
  }
  
  get hostId () {
    return this.hostTarget.dataset.participantId
  }
  
  get hostVideo () {
    return this.hostTarget.querySelector('video')
  }
  
  connect () {
    this.channel = playerChannel
    this.channel.playerId = parseInt(this.hostId)
    
    this.announceParticipation = this.announceParticipation.bind(this)
    this.join = this.join.bind(this)
    this.leave = this.leave.bind(this)
    
    _.defer(this.leave)
    _.defer(this.announceParticipation)
  }
  
  disconnect () {
    this.leave()
    window.removeEventListener('unload', this.leave)
  }
  
  stopCapture () {
    if (this.hostStream) {
      for (let track of this.hostStream.getTracks()) track.stop()
      delete this.hostStream
    }
  }
  
  join () {
    this.announceParticipation()
    
    navigator.mediaDevices
             .getUserMedia(this.mediaConstraints)
             .then(this.streamMedia.bind(this))
  }
  
  leave () {
    this.sendBroadcast({
      type: REMOVE_PARTICIPANT,
      from: this.hostId
    })
    
    if (this.hostStream) {
      for (const [participantId, peer] of Object.entries(this.channel.peers)) {
        peer.removeStream(this.hostStream)
      }
    }
    
    this.channel.disconnectAllPeers()
    
    this.hostVideo.srcObject = null
    this.stopCapture()
  }
  
  announceParticipation() {
    this.sendBroadcast({
      type: ADD_PARTICIPANT,
      from: this.hostId
    })
  }
  
  sendBroadcast (data = {}) {
    this.channel.sendVideoChatBroadcast(data)
  }
  
  receiveBroadcast (data) {
    let { type, from, to } = data
    
    switch (type) {
      case ADD_PARTICIPANT:
        this.getParticipant(from)
        break
      
      case REMOVE_PARTICIPANT:
        this.removeParticipant(from)
        break
      
      case EXCHANGE_SIGNAL:
        if (to == this.hostId) this.receiveSignal(from, data.signal)
        break
      
      default:
        console.warn('Unsupported broadcast type', type)
        break
    }
  }
  
  broadcastSignal (participantId, data) {
    const signal = JSON.stringify(data)
    this.sendBroadcast({
      type:   EXCHANGE_SIGNAL,
      from:   this.hostId,
      to:     participantId,
      signal: signal
    })
  }
  
  receiveSignal (participantId, signal) {
    const peer = this.getParticipant(participantId)
    peer.signal(signal)
  }
  
  getParticipant (participantId) {
    if (!this.channel.peers[participantId]) {
      const initiator = [participantId, this.hostId].sort()[0] == this.hostId
      const stream = participantId !== this.hostId && this.hostStream
      const peer = this.channel.peers[participantId] = new Peer({ initiator: initiator, stream: stream })
      
      peer.on('signal', (signal) => this.broadcastSignal(participantId, signal))
      
      peer.on('data',    (d) => console.log(`received: ${d}`))
      peer.on('connect', () => peer.send(`connected ${participantId} with ${this.hostId}`))
      
      peer.on('stream', (stream) => this.streamParticipantVideo(participantId, stream))
      
      this.announceParticipation()
    }
    
    return this.channel.peers[participantId]
  }
  
  removeParticipant (participantId) {
    const video = this.getParticipantVideo(participantId)
    
    if (video) {
      video.pause()
      video.srcObject = null
      video.load()
    }
    
    this.channel.disconnectPeer(participantId)
  }
  
  streamMedia (stream) {
    this.streamToVideo(stream, this.hostVideo, true)
    this.hostStream = stream
    
    for (const [participantId, peer] of Object.entries(this.channel.peers)) {
      if (participantId !== this.hostId) {
        peer.addStream(stream)
      }
    }
  }
  
  streamToVideo (stream, video, muted = false) {
    if (stream && video) {
      video.srcObject = stream
      video.muted = muted
      video.autoplay = 'autoplay'
      video.playsinline = 'playsinline'
      video.play()
    }
  }
  
  streamParticipantVideo (participantId, stream) {
    const video = this.getParticipantVideo(participantId)
    this.streamToVideo(stream, video)
  }
  
  getParticipantVideo (participantId) {
    const participant = this.participantTargets.find((el) => el.dataset.participantId == participantId)
    return participant && participant.querySelector('video')
  }
}
