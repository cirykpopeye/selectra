import SelectraElement from './SelectraElement'

class Selectra {
  constructor (selector, config = {}) {
    this.config = config
    this.selector = selector
  }

  init () {
    document.querySelectorAll(this.selector).forEach(element => {
      const selectraElement = new SelectraElement(element, this.config)
      selectraElement.init()
    })
  }
}

export default Selectra
