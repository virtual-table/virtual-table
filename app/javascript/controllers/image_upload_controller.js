import ApplicationController from 'controllers/application_controller'
import { DirectUpload } from '@rails/activestorage'

export default class extends ApplicationController {
  
  static targets = ['input', 'output', 'progress', 'progressBar', 'preview']
  
  connect () {
    this.inputTarget.insertAdjacentHTML('afterend', `<input type="hidden" data-target="image-upload.output">`)
  }
  
  upload () {
    if (this.outputTarget.name) {
      this.inputTarget.name  = this.outputTarget.name
      this.outputTarget.name = null
    }
    
    this.inputTarget.disabled = true
    
    Array.from(this.inputTarget.files).forEach(file => {
      this.previewFile(file)
      this.directUploadFile(file)
    })
  }
  
  unPreview () {
    if (this.hasPreviewTarget) {
      this.previewTarget.innerHTML = ''
    }
  }
  
  previewFile (file) {
    if (this.hasPreviewTarget) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.previewTarget.innerHTML = `<img src="${event.target.result}" />`
      }
      reader.readAsDataURL(file)
    }
  }
  
  directUploadFile (file) {
    console.log('directUploadFile', file)
    
    const url    = this.inputTarget.dataset.directUploadUrl
    const upload = new DirectUpload(file, url, this)
    
    if (this.hasProgressBarTarget) {
      this.progressBarTarget.classList.add('enabled')
    }
    
    if (this.hasProgressTarget) {
      const progress = 0
      this.progressTarget.innerHTML   = `${progress}%`
      this.progressTarget.style.width = `${progress}%`
    }
    
    upload.create((error, blob) => {
      if (error) {
        this.directUploadError(upload, error)
      } else {
        this.directUploadSuccess(upload, blob)
      }
    })
  }
  
  directUploadError (upload, error) {
    console.log('upload error', upload, error)
    
    this.unPreview()
    this.inputTarget.disabled = false
  }
  
  directUploadSuccess (upload, blob) {
    console.log('upload success', upload, blob)
    
    if (this.inputTarget.name) {
      this.outputTarget.name = this.inputTarget.name
      this.inputTarget.name  = null
    }
    
    this.outputTarget.value   = blob.signed_id
    this.inputTarget.disabled = false
    
    if (this.hasProgressBarTarget) {
      this.progressBarTarget.classList.remove('enabled')
    }
  }
  
  directUploadWillStoreFileWithXHR(request) {
    request.upload.addEventListener('progress', event => this.directUploadDidProgress(event))
  }
  
  directUploadDidProgress(event) {
    console.log('directUploadDidProgress', event)
    
    // Use event.loaded and event.total to update the progress bar
    if (this.hasProgressTarget) {
      const progress = Math.round(event.loaded / event.total * 100)
      this.progressTarget.innerHTML   = `${progress}%`
      this.progressTarget.style.width = `${progress}%`
    }
  }
}
