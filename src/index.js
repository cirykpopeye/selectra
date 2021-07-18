import Selectra from './Selectra'

export const createSelectra = (selectorOrElements, config = {}) => {
  const selectraInstance = new Selectra(selectorOrElements, config)
  selectraInstance.init()
}

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
