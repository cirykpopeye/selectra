import Selectra from './Selectra'

export const createSelectra = (selector, config = {}) => {
  const selectraInstance = new Selectra(selector, config)
  selectraInstance.init()
}

// Bind to window
window.Selectra = Selectra
window.createSelectra = createSelectra
