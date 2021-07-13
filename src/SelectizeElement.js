import { createPopper } from '@popperjs/core'

class SelectizeElement {
  constructor (
    element,
    id,
    {
      search = false,
      langInputPlaceholder = 'Search',
      langEmptyValuePlaceholder = 'Pick a value'
    }
  ) {
    this.search = search
    this.element = element
    this.id = id.replace(/[#.]/g, '')
    this.multiple = element.hasAttribute('multiple')
    this.classes = Array.from(this.element.classList)

    // Translations
    this.langInputPlaceholder = langInputPlaceholder
    this.langEmptyValuePlaceholder = langEmptyValuePlaceholder
  }

  init () {
    this.addClass()
    this.addCustomSelector()
    this.addListeners()
  }

  addClass () {
    this.element.classList.add('selectize-js-element')
  }

  addCustomSelector () {
    this.element.insertAdjacentHTML('afterend', `
      <div class="selectize-js-container" id="${this.id}-container">
        ${this.search ? (`<input class="${[...this.classes, 'selectize-js-input'].join(' ')}" placeholder="${this.langInputPlaceholder}" id="${this.id}-handler" value="${this.getCurrentLabel()}" />`) : (`<button type="button" class="${[...this.classes, 'selectize-js-btn'].join(' ')}" id="${this.id}-handler">${this.getCurrentLabel()}</button>`)}
        <div class="selectize-js-options" id="${this.id}-options">${this.getOptionsHTML()}</div>
      </div>
    `)
    this.handler = this.element.parentElement.querySelector(`#${this.id}-handler`)
    this.options = this.element.parentElement.querySelector(`#${this.id}-options`)

    this.popperInstance = createPopper(this.handler, this.options, {
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
      const clickTarget = document.querySelector(`#${this.id}-container`)
      if (!e.composedPath().includes(clickTarget)) {
        this.hideOptions()
      }
    })
  }

  optionsListener () {
    this.options.querySelectorAll('.selectize-js-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectValue(option.dataset.value)
      })
    })
  }

  filterListener () {
    this.handler.addEventListener('input', () => {
      const optionElements = document.getElementById(`${this.id}-options`)
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
      optionElements.innerHTML = this.getOptionsHTML(options)
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
    this.element.parentElement.querySelector(`#${this.id}-handler`).innerText = this.getCurrentLabel()
  }

  showOptions () {
    this.handler.value = ''
    this.options.classList.add('open')
    this.popperInstance.update()
  }

  hideOptions () {
    this.handler.value = this.getCurrentLabel()
    this.options.innerHTML = this.getOptionsHTML()
    this.optionsListener()
    this.options.classList.remove('open')
  }

  getOptionsHTML (options = this.getOptions()) {
    let html = ''
    for (const option of options) {
      if ('options' in option) {
        html += `
          <div class="selectize-js-option-group">
            <span class="selectize-js-option-group-label">${option.label}</span>
            ${this.getOptionsHTML(option.options)}
          </div>
        `
      } else {
        html += `<div class="selectize-js-option" data-value="${option.value}" data-selected="${option.selected}">${option.label}</div>`
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
          selected: this.multiple ? optionElement.hasAttribute('selected') : this.element.value === optionElement.getAttribute('value')
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

export default SelectizeElement
