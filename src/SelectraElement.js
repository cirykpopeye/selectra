import { createPopper } from '@popperjs/core'
import { unescape } from 'html-escaper'
import dropdown from './assets/dropdown.svg'
import trash from './assets/trash.svg'

class SelectraElement {
  constructor (
    element,
    {
      search = false,
      langInputPlaceholder = 'Search',
      langEmptyValuePlaceholder = 'Pick a value',
      langOptionsEmptyPlaceholder = 'There are no more options',
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
    this.langOptionsEmptyPlaceholder = langOptionsEmptyPlaceholder
  }

  init () {
    this.addOptions()
    this.markAsSelected()
    this.addClass()
    this.addCustomSelector()
    this.addListeners()
    this.addCustomValueMethod()
    this.adaptColors()
  }

  addOptions () {
    const fragment = new DocumentFragment()
    if (this.options) {
      for (const option of this.options) {
        if ('options' in option) {
          this.addGroup(fragment, option)
        } else {
          this.addOption(fragment, option)
        }
      }
    }
    this.element.appendChild(fragment)
  }

  markAsSelected () {
    Array.from(this.element.selectedOptions).forEach(option => {
      option.selected = true
    })
  }

  addGroup (fragment, group) {
    const groupElement = document.createElement('optgroup')
    groupElement.setAttribute('label', unescape(group.label))
    for (const option of group.options) {
      this.addOption(groupElement, option)
    }
    fragment.appendChild(groupElement)
  }

  addOption (fragment, option) {
    const optionElement = document.createElement('option')
    optionElement.value = escape(option.value)
    optionElement.selected = !!option.selected
    optionElement.disabled = !!option.disabled
    optionElement.innerHTML = option.label
    fragment.appendChild(optionElement)
  }

  adaptColors () {
    this.handlerIcon.style.fill = window.getComputedStyle(this.handler).color
  }

  addCustomValueMethod () {
    Object.defineProperty(this.element, 'val', {
      value: (val) => val ? this.setValue.bind(this)(val) : this.getValue.bind(this)(),
      configurable: true
    })
  }

  getValue () {
    if (this.multiple) {
      return Array.from(this.element.options).filter(option => option.selected).map(selectedOption => selectedOption.value)
    }
    return unescape(this.element.value)
  }

  setValue (val) {
    if (this.multiple) {
      Array.from(this.element.options).forEach((option) => {
        option.selected = false
      })
      // Add selected for remaining items
      if (Array.isArray(val)) {
        for (const value of val) {
          this.selectValue(value)
        }
      } else {
        this.selectValue(val)
      }
    } else {
      this.element.value = val
    }
    this.setCurrentLabel()
  }

  addClass () {
    this.element.classList.add('selectra-element')
  }

  addCustomSelector () {
    this.customSelector = document.createElement('div')
    this.customSelector.innerHTML = `
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
    `
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
    this.keysListener()
  }

  addShowHideListener () {
    const openOptions = () => {
      if (this.element.disabled) return false
      this.showOptions()

      // Close all the others
      document.querySelectorAll('.selectra-element').forEach(el => {
        if (el !== this.element) el.dispatchEvent(new Event('close'))
      })
    }
    this.element.addEventListener('focus', () => {
      openOptions()
    })
    this.element.addEventListener('mousedown', () => {
      openOptions()
    })
    this.handler.addEventListener('mousedown', () => {
      openOptions()
    })
    this.element.addEventListener('close', () => {
      this.hideOptions()
    })
    document.addEventListener('click', e => {
      if (!e.composedPath().includes(this.customSelector)) {
        this.hideOptions()
      }
    })
  }

  optionsListener () {
    this.optionsElement.querySelectorAll('.selectra-option:not([data-disabled="true"])').forEach(option => {
      option.addEventListener('mouseup', () => {
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
      if (options.length === 0) {
        this.optionsElement.innerHTML = this.langOptionsEmptyPlaceholder
      } else {
        this.optionsElement.innerHTML = this.getOptionsHTML(options)
      }
      this.optionsListener()
    })
  }

  keysListener () {
    document.addEventListener('keydown', (e) => {
      if (!['ArrowUp', 'ArrowDown', 'Enter', 'Space'].includes(e.code)) return true
      if (!this.isOpen()) return true

      e.preventDefault()

      if (e.code === 'Enter') {
        if (this.element.value) this.hideOptions()
        return true
      }

      if (e.code === 'Space' && this.multiple) {
        const activeOption = this.optionsElement.querySelector('.selectra-option[data-active="true"]')
        if (!activeOption) return true

        this.selectValue(activeOption.dataset.value, false)
        return true
      }


      if (this.multiple) {
        const options = Array.from(this.optionsElement.querySelectorAll('.selectra-option'))

        // Do not auto select, only when using space bar
        let activeIndex = -1
        const activeOption = options.find(option => option.getAttribute('data-active') === 'true')
        if (activeOption) {
          activeIndex = options.indexOf(activeOption)
        }

        // Disable all
        options.forEach(option => {
          option.setAttribute('data-active', false)
        })

        if (e.code === 'ArrowUp') {
          if (options[activeIndex - 1]) activeIndex = activeIndex - 1
          else activeIndex = options.length - 1
        } else {
          if (options[activeIndex + 1]) activeIndex = activeIndex + 1
          else activeIndex = 0
        }

        let nextOption = options[activeIndex]
        if (nextOption) nextOption.setAttribute('data-active', true)
      } else {
        const options = this.getOptions(this.element, true)

        if (this.element.value) {
          // Select the next one
          const currentIndex = options.findIndex(option => option.value === this.element.value)
          if (currentIndex + (e.code === 'ArrowUp' ? -1 : 1) < options.length && currentIndex + (e.code === 'ArrowUp' ? -1 : 1) > -1) {
            this.selectValue(options[currentIndex + (e.code === 'ArrowUp' ? -1 : 1)].value, false)
          } else if (e.code === 'ArrowUp') {
            // Select the last one
            if (options.length) this.selectValue(options[options.length - 1].value, false)
          } else {
            // Select the first one
            if (options.length) this.selectValue(options[0].value, false)
          }
        } else if (e.code === 'ArrowUp') {
          // Select the first one
          if (options.length) this.selectValue(options[options.length - 1].value, false)
        } else {
          // Select the first one
          if (options.length) this.selectValue(options[0].value, false)
        }
      }
    })
  }

  selectValue (value, closeOnSelect = true) {
    // Get current value
    const currentValue = this.multiple ? [...this.getValue()] : this.getValue()
    if (this.multiple) {
      // Remove selected from all of the items
      Array.from(this.element.options).forEach((option) => {
        option.selected = false
        this.optionsElement.querySelector('.selectra-option[data-value="' + value + '"]').dataset.selected = false
      })

      // Find value in currentValue
      const valueIndex = currentValue.indexOf(value)
      if (valueIndex !== -1) {
        currentValue.splice(valueIndex, 1)
      } else {
        // Add current value
        currentValue.push(value)
      }

      // Add selected for remaining items
      for (const value of currentValue) {
        this.element.querySelector('option[value="' + value + '"]').selected = true
        this.optionsElement.querySelector('.selectra-option[data-value="' + value + '"]').dataset.selected = true
      }
    } else {
      // Check if option is disabled yes or no
      const option = this.options[this.options.findIndex(option => option.value === value)]
      if (option && option.disabled) return false

      this.element.value = value
      // Deselect all
      this.optionsElement.querySelectorAll('.selectra-option').forEach(option => {
        option.dataset.selected = false
      })
      this.optionsElement.querySelector('.selectra-option[data-value="' + value + '"]').dataset.selected = true
    }
    this.element.dispatchEvent(new Event('change'))
    this.setCurrentLabel()
    if (closeOnSelect) this.hideOptions()
  }

  getCurrentLabel () {
    const options = this.getOptions(this.element, true)
    const value = this.getValue()
    if (this.multiple && value.length) {
      return Array.from(this.element.options).filter(option => {
        return value.includes(unescape(option.value))
      }).map(option => unescape(option.innerHTML)).join(', ')
    } else {
      const option = options.find(option => {
        return unescape(option.value) === value
      })
      if (option) return unescape(option.label)
    }
    return this.langEmptyValuePlaceholder
  }

  setCurrentLabel () {
    this.handler.innerText = this.getCurrentLabel()
  }

  isOpen () {
    return this.optionsElement.classList.contains('open')
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
          value: optionElement.value,
          label: unescape(optionElement.innerHTML),
          selected: this.multiple ? optionElement.selected : this.element.value === optionElement.value,
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
