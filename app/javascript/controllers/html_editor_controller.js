import ApplicationController from 'controllers/application_controller'
import Quill from 'lib/quill'

export default class extends ApplicationController {
  
  static targets = ['input', 'editor']
  
  get editorHTML () {
    return this.element.querySelector('.ql-editor').innerHTML
  }
  
  connect () {
    this.editorTarget.innerHTML = this.inputTarget.value
    
    this.quill = new Quill(this.editorTarget, {
      theme:   'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline'],
          ['link', 'blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }]
        ]
      }
    })
    
    this.quill.on('text-change', this.updateInput.bind(this))
    
    this.inputTarget.style.display = 'none'
  }
  
  updateInput () {
    this.inputTarget.value = this.editorHTML
  }
}
