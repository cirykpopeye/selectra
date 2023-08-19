import Selectra from './Selectra'
import { createSelectra } from './index'

// Create web component
class SelectraComponent extends HTMLSelectElement {
  constructor () {
    super()
    createSelectra(this)
  }
}
customElements.define('selectra-input', SelectraComponent, { extends: 'select' })

// Bind to window
window.Selectra = Selectra
window.createSelectra = createSelectra
