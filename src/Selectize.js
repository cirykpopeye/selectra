import SelectizeElement from './SelectizeElement'

class Selectize {
  constructor (selector, config = {}) {
    this.config = config
    this.selector = selector
    this.counter = 1
    this.elements = document.querySelectorAll(selector)
    this.init()
  }

  init () {
    this.elements.forEach(element => {
      const selectizeElement = new SelectizeElement(element, `${this.selector}-${this.counter}`, this.config)
      selectizeElement.init()
      this.counter++
    })
  }
}

export default Selectize
