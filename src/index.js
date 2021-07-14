import Selectize from './Selectize'

export const createSelectize = (selector, config = {}) => {
  const selectizeInstance = new Selectize(selector, config)
  selectizeInstance.init()
}

// Bind to window
window.Selectize = Selectize
window.createSelectize = createSelectize
