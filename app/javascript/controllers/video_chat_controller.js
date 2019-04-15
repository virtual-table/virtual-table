import ApplicationController from 'controllers/application_controller'
import playerChannel from 'channels/player_channel'
import _ from 'underscore'

const DEFAULT_MEDIA_CONSTRAINTS = {
  audio: true,
  video: true
}

export default class extends ApplicationController {
  
  static targets = ['host', 'participant', 'devices']
  
  get mediaConstraints () {
    return this._mediaConstraints || (
      this._mediaConstraints = DEFAULT_MEDIA_CONSTRAINTS
    )
  }
  
  set mediaConstraints (newMediaConstraints) {
    this._mediaConstraints = newMediaConstraints
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
  }
  
  disconnect () {
    this.stopStreaming()
  }
  
  startBroadcast () {
    this.channel.startP2PStream(this.hostStream)
  }
  
  stopBroadcast () {
    this.channel.stopP2PStream(this.hostStream)
  }
  
  startStreaming () {
    navigator.mediaDevices
      .getUserMedia(this.mediaConstraints)
      .then((stream) => {
        this.hostStream = stream
        
        this.addStream(this.hostId, stream)
        this.gatherStreamingDevices()
        
        this.startBroadcast()
      })
  }
  
  addStream (participantId, stream) {
    if (participantId == this.hostId) {
      this.streamToVideo(stream, this.hostVideo, true)
    } else {
      const video = this.getParticipantVideo(participantId)
      this.streamToVideo(stream, video)
    }
  }
  
  stopStreaming () {
    const stream = this.hostStream
    
    if (stream) {
      this.stopBroadcast()
      
      for (let track of stream.getTracks()) track.stop()
      
      this.hostStream = null
    }
  }
  
  streamToVideo (stream, video, muted = false) {
    if (stream && video) {
      video.srcObject   = stream
      video.muted       = muted
      video.autoplay    = 'autoplay'
      video.playsinline = 'playsinline'
    }
  }
  
  changeStreamingDevice () {
    this.currentMediaDevice = this.devicesTarget.value
    
    this.mediaConstraints = _.extend(DEFAULT_MEDIA_CONSTRAINTS, {
      video: {
        deviceId: { exact: this.currentMediaDevice }
      }
    })
    
    this.stopStreaming()
    this.startStreaming()
  }
  
  gatherStreamingDevices () {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices = devices.filter((device) => device.kind == 'videoinput')
        
        let select = this.devicesTarget
        select.innerHTML = ''
        
        devices.forEach((device, i) => {
          let option = document.createElement('option')
          let label = document.createTextNode(device.label || `Camera ${i + 1}`)
          
          option.value    = device.deviceId
          option.selected = device.deviceId == this.currentMediaDevice
          option.appendChild(label)
          
          select.appendChild(option)
        })
        
        if (devices.length > 1) {
          select.style.display = 'inline'
        } else {
          select.style.display = 'none'
        }
      })
  }
  
  getParticipantElement (participantId) {
    return this.participantTargets.find((el) => el.dataset.participantId == participantId)
  }
  
  getParticipantVideo (participantId) {
    const participant = this.getParticipantElement(participantId)
    return participant && participant.querySelector('video')
  }
}
