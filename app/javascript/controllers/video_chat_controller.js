import ApplicationController from 'controllers/application_controller'
import playerChannel from 'channels/player_channel'

// Broadcast Types
const ADD_PLAYER    = 'ADD_PLAYER'
const EXCHANGE      = 'EXCHANGE'
const REMOVE_PLAYER = 'REMOVE_PLAYER'

const ice = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

export default class extends ApplicationController {
  
  static targets = ['host', 'participant']
  
  get mediaConstraints () {
    return {
      audio: false,
      video: true
    }
  }
  
  get hostId () {
    return this.hostTarget.dataset.playerId
  }
  
  get hostVideo () {
    return this.hostTarget.querySelector('video')
  }
  
  connect () {
    this.peers   = {}
    this.channel = playerChannel
    this.channel.playerId = parseInt(this.hostId)
    this.join()
  }
  
  disconnect () {
    this.leave()
  }
  
  stopCapture () {
    if (this.hostStream) {
      for (let track of this.hostStream.getTracks()) track.stop()
      delete this.hostStream
    }
  }
  
  join () {
    navigator.mediaDevices.getUserMedia(this.mediaConstraints).then(
      (stream) => {
        this.hostStream = stream
        this.hostVideo.srcObject = stream
        this.hostVideo.muted = true
        
        this.sendBroadcast({
          type: ADD_PLAYER,
          from: this.hostId
        })
      }
    )
  }
  
  leave () {
    this.sendBroadcast({
      type: REMOVE_PLAYER,
      from: this.hostId
    })
    
    this.hostVideo.srcObject = null
    this.stopCapture()
  }
  
  sendBroadcast (...args) {
    this.channel.sendVideoChatBroadcast(...args)
  }
  
  receiveBroadcast (data) {
    let { type, from, to } = data
    
    if (from == this.hostId) return
    
    switch (type) {
      case ADD_PLAYER:
        return this.addPlayerVideo(from)
      
      case REMOVE_PLAYER:
        return this.removePlayerVideo(from)
      
      case EXCHANGE:
        if (to !== this.hostId) return
        return this.exchange(from, data)
      
      default:
        console.warn('Unsupported broadcast type', type)
        return
    }
    
    console.log('receiveBroadcast', type, playerId, data)
  }
  
  removePlayerVideo (playerId) {
    let video = this.getParticipantVideo(playerId)
    video.srcObject = null
    delete this.peers[playerId]
  }
  
  addPlayerVideo (playerId) {
    this.createPeerConnection(playerId, true)
  }
  
  async createPeerConnection (playerId, isOffer) {
    let pc = this.peers[playerId] = new RTCPeerConnection(ice)
    
    if (this.hostStream) {
      this.connectStream(pc, this.hostStream)
    } else {
      const stream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints)
      this.connectStream(pc, stream)
    }
    
    if (isOffer) {
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          this.sendBroadcast({
            type: EXCHANGE,
            from: this.hostId,
            to:   playerId,
            sdp:  pc.localDescription
          })
        }).catch(console.error)
    }
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendBroadcast({
          type:      EXCHANGE,
          from:      this.hostId,
          to:        playerId,
          candidate: event.candidate
        })
      }
    };
    
    pc.ontrack = (event) => {
      const video = this.getParticipantVideo(playerId)
      if (!video || video.srcObject) return
      
      video.autoplay  = 'autoplay'
      video.srcObject = event.streams[0]
    }
    
    pc.oniceconnectionstatechange = (event) => {
      if (pc.iceConnectionState == 'disconnected') {
        this.sendBroadcast({
          type: REMOVE_PLAYER,
          from: playerId
        })
      }
    }
    
    return pc
  }
  
  connectStream (pc, stream) {
    const tracks = stream.getTracks()
    tracks.forEach(track => pc.addTrack(track, stream))
  }
  
  exchange (playerId, data) {
    const { sdp, candidate } = data
    let pc = this.peers[playerId]
    
    if (!this.peers[playerId]) {
      pc = this.createPeerConnection(playerId, false)
    }
    
    if (candidate) {
      pc.addIceCandidate(new RTCIceCandidate(candidate))
    }
    
    if (sdp) {
      pc.setRemoteDescription(new RTCSessionDescription(sdp))
        .then(() => {
          if (sdp.type === 'offer') {
            pc.createAnswer()
              .then((answer) => pc.setLocalDescription(answer))
              .then(()=> {
                this.sendBroadcast({
                  type: EXCHANGE,
                  from: this.hostId,
                  to:   playerId,
                  sdp:  pc.localDescription
                })
              }).catch(console.error)
          }
        })
    }
  }
  
  logError (error) {
    console.warn('Error:', error)
  }
  
  getParticipantVideo (playerId) {
    const participant = this.participantTargets.find((el) => el.dataset.playerId == playerId)
    return participant.querySelector('video')
  }
}
