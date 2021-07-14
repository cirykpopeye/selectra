import SelectizeElement from './SelectizeElement'

class Selectize {
  constructor (selector, config = {}) {
    this.config = config
    this.selector = selector
  }

  init () {
    document.querySelectorAll(this.selector).forEach(element => {
      const selectizeElement = new SelectizeElement(element, this.config)
      selectizeElement.init()
    })
  }
}

export default Selectize
