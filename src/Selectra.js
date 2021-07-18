import SelectraElement from './SelectraElement'

class Selectra {
  constructor (selectorOrElements, config = {}) {
    this.config = config
    this.selectorOrElements = selectorOrElements
  }

  init () {
    if (typeof this.selectorOrElements === 'string') {
      document.querySelectorAll(this.selectorOrElements).forEach(element => {
        const selectraElement = new SelectraElement(element, this.config)
        selectraElement.init()
      })
    } else {
      if (this.selectorOrElements instanceof HTMLElement) {
        const selectraElement = new SelectraElement(this.selectorOrElements, this.config)
        selectraElement.init()
      } else {
        for (const element of Array.from(this.selectorOrElements)) {
          const selectraElement = new SelectraElement(element, this.config)
          selectraElement.init()
        }
      }
    }
  }
}

export default Selectra
