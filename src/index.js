import Selectra from './Selectra'
import { escape, unescape } from 'html-escaper'

export const createSelectra = (selector, config = {}) => {
  const selectraInstance = new Selectra(selector, config)
  selectraInstance.init()
}

// Bind to window
window.Selectra = Selectra
window.createSelectra = createSelectra

window.escape = escape
window.unescape = unescape
