import Selectra from './Selectra'

export const createSelectra = (selectorOrElements, config = {}) => {
  const selectraInstance = new Selectra(selectorOrElements, config)
  selectraInstance.init()
}

export default Selectra
