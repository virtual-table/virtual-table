import ApplicationController from 'controllers/application_controller'
import { DirectUpload } from '@rails/activestorage'

export default class extends ApplicationController {
  
  static targets = ['input', 'output', 'progress', 'progressBar', 'preview']
  
  upload () {
    this.outputTarget.value = null
    this.inputTarget.disabled = true
    
    const files = Array.from(this.inputTarget.files)
    files.forEach(file => {
      this.previewFile(file)
      this.directUploadFile(file)
    })
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
  }
  
  directUploadSuccess (upload, blob) {
    console.log('upload success', upload, blob)
    
    this.inputTarget.value    = null
    this.inputTarget.disabled = false
    
    this.outputTarget.value = blob.signed_id
    
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
