import SelectizeElement from './SelectizeElement'

class Selectize {
  constructor (selector, config = {}) {
    this.config = config
    this.selector = selector
  }

  init () {
    let counter = 0
    document.querySelectorAll(this.selector).forEach(element => {
      const selectizeElement = new SelectizeElement(element, `${this.selector}-${counter}`, this.config)
      selectizeElement.init()
      counter++
    })
  }
}

export default Selectize
