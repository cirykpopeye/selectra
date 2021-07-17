import { createPopper } from '@popperjs/core'
import dropdown from './assets/dropdown.svg'
import trash from './assets/trash.svg'

class SelectraElement {
  constructor (
    element,
    {
      search = false,
      langInputPlaceholder = 'Search',
      langEmptyValuePlaceholder = 'Pick a value',
      options = false
    }
  ) {
    this.search = search
    this.element = element
    this.multiple = element.multiple
    this.disabled = element.disabled
    this.classes = Array.from(this.element.classList)
    this.options = options

    // Translations
    this.langInputPlaceholder = langInputPlaceholder
    this.langEmptyValuePlaceholder = langEmptyValuePlaceholder
  }

  init () {
    this.addOptions()
    this.addClass()
    this.addCustomSelector()
    this.addListeners()
    this.addCustomValueMethod()
    this.adaptColors()
  }

  addOptions () {
    if (this.options) {
      for (const option of this.options) {
        if ('options' in option) {
          this.addGroup(option)
        } else {
          this.addOption(this.element, option)
        }
      }
    }
  }

  addGroup (group) {
    const groupElement = document.createElement('optgroup')
    groupElement.setAttribute('label', group.label)
    for (const option of group.options) {
      this.addOption(groupElement, option)
    }
    this.element.insertAdjacentElement(
      'beforeend',
      groupElement
    )
  }

  addOption (element, option) {
    element.insertAdjacentHTML(
      'beforeend',
      `<option value="${option.value}" ${option.selected ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}>${option.label}</option>`
    )
  }

  adaptColors () {
    this.handlerIcon.style.fill = window.getComputedStyle(this.handler).color
  }

  addCustomValueMethod () {
    Object.defineProperty(this.element, 'val', {
      value: this.getValue.bind(this),
      configurable: true
    })
  }

  getValue () {
    if (this.multiple) {
      return Array.from(this.element.selectedOptions).map(selectedOption => selectedOption.value)
    }
    return this.element.value
  }

  addClass () {
    this.element.classList.add('selectra-element')
  }

  addCustomSelector () {
    this.customSelector = document.createElement('div')
    this.customSelector.insertAdjacentHTML('afterbegin', `
      <div class="selectra-options">${this.getOptionsHTML()}</div>
      <div class="selectra-handler-container">
        ${
          this.search
          ? (
            `<input
              class="${[...this.classes, 'selectra-handler', 'selectra-input'].join(' ')}" 
              ${this.disabled ? 'disabled' : ''} 
              placeholder="${this.langInputPlaceholder}" 
              value="${this.getCurrentLabel()}" 
            />`
          )
          : (
            `<button
              type="button"
              class="${[...this.classes, 'selectra-handler', 'selectra-btn'].join(' ')}" 
              ${this.disabled ? 'disabled' : ''}
            >
              ${this.getCurrentLabel()}
            </button>`
          )
        }
        <span class="selectra-handler-icon">${dropdown}</span>
      </div>
    `)
    this.customSelector.classList.add('selectra-container')
    this.element.insertAdjacentElement('afterend', this.customSelector)
    this.handlerContainer = this.customSelector.querySelector('.selectra-handler-container')
    this.handler = this.customSelector.querySelector('.selectra-handler')
    this.handlerIcon = this.customSelector.querySelector('.selectra-handler-icon')
    this.optionsElement = this.customSelector.querySelector('.selectra-options')

    this.popperInstance = createPopper(this.handler, this.optionsElement, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          enabled: true,
          options: {
            offset: [0, 10]
          }
        }
      ]
    })
  }

  addListeners () {
    this.addShowHideListener()
    this.optionsListener()
    this.filterListener()
  }

  addShowHideListener () {
    this.element.addEventListener('focus', () => {
      this.handler.focus()
    })
    this.handler.addEventListener('focus', () => {
      this.showOptions()
    })
    document.addEventListener('click', e => {
      if (!e.composedPath().includes(this.customSelector)) {
        this.hideOptions()
      }
    })
  }

  optionsListener () {
    this.optionsElement.querySelectorAll('.selectra-option:not([data-disabled="true"])').forEach(option => {
      option.addEventListener('click', () => {
        this.selectValue(option.dataset.value)
      })
    })
  }

  filterListener () {
    this.handler.addEventListener('input', () => {
      const options = this.getOptions().map(option => {
        if ('options' in option) {
          option.options = option.options.filter(opt => {
            return opt.label.toLowerCase().trim().includes(this.handler.value.toLowerCase().trim())
          })
        }
        return option
      }).filter(option => {
        if ('options' in option) return option.options.length > 0
        return option.label.toLowerCase().trim().includes(this.handler.value.toLowerCase().trim())
      })
      this.optionsElement.innerHTML = this.getOptionsHTML(options)
      this.optionsListener()
    })
  }

  selectValue (value) {
    if (this.multiple) {
      // Toggle selected for this element
      const valueOption = Array.from(this.element.options).find(option => {
        return option.value === value
      })
      if (valueOption.hasAttribute('selected')) {
        valueOption.removeAttribute('selected')
      } else {
        valueOption.setAttribute('selected', true)
      }
      const options = []
      Array.from(this.element.selectedOptions).forEach(selectedOption => {
        options.push(selectedOption.value)
      })
    } else {
      this.element.value = value
    }
    this.setCurrentLabel()
    this.hideOptions()
  }

  getCurrentLabel () {
    const options = this.getOptions(this.element, true)
    if (this.multiple && Array.from(this.element.selectedOptions).length) {
      return Array.from(this.element.selectedOptions).map(selectedOption => {
        return selectedOption.innerHTML
      }).join(', ')
    } else {
      const option = options.find(option => {
        return option.value === this.element.value
      })
      if (option) return option.label
    }
    return this.langEmptyValuePlaceholder
  }

  setCurrentLabel () {
    this.handler.innerText = this.getCurrentLabel()
  }

  showOptions () {
    this.handler.value = ''
    this.optionsElement.classList.add('open')
    this.popperInstance.update()
  }

  hideOptions () {
    this.handler.value = this.getCurrentLabel()
    this.optionsElement.innerHTML = this.getOptionsHTML()
    this.optionsListener()
    this.optionsElement.classList.remove('open')
  }

  getOptionsHTML (options = this.getOptions()) {
    let html = ''
    for (const option of options) {
      if ('options' in option) {
        html += `
          <div class="selectra-option-group">
            <span class="selectra-option-group-label">${option.label}</span>
            ${this.getOptionsHTML(option.options)}
          </div>
        `
      } else {
        html += `
          <div class="selectra-option" data-value="${option.value}" data-selected="${option.selected}" data-disabled="${option.disabled}">
            ${option.label}
            ${option.selected && this.multiple ? '<span class="selectra-option-icon">' + trash + '</span>' : ''}
          </div>`
      }
    }
    return html
  }

  getOptions (element = this.element, flat = false) {
    const options = []
    const optionElements = element.querySelectorAll('optgroup, option')
    optionElements.forEach(optionElement => {
      if (optionElement.parentElement !== element && !flat) return
      if (optionElement.tagName === 'OPTION') {
        options.push({
          value: optionElement.getAttribute('value'),
          label: optionElement.innerHTML,
          selected: this.multiple ? optionElement.selected : this.element.value === optionElement.getAttribute('value'),
          disabled: !!optionElement.disabled
        })
      } else if (!flat && optionElement.tagName === 'OPTGROUP') {
        // Opt group
        options.push({
          label: optionElement.getAttribute('label'),
          options: this.getOptions(optionElement)
        })
      }
    })
    return options
  }
}

export default SelectraElement
