import { createSelectra } from '../src/index'

describe('simple select', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="test-select"><option value="option1">Option 1</option><option value="option2">Option 2</option><option value="option3" disabled>Option 3</option></select>
    `
    createSelectra('#test-select')
  })
  
  test('creates custom selector after init', () => {
    const selectraContainer = document.querySelector('.selectra-container')
    const selectraOptions = selectraContainer.querySelector('.selectra-options')
  
    expect(selectraContainer).not.toBeNull()
    expect(selectraContainer.querySelector('.selectra-handler')).not.toBeNull()
    expect(selectraOptions).not.toBeNull()
    expect(selectraOptions.classList.contains('open')).toBe(false)
    expect(selectraContainer.querySelectorAll('.selectra-option').length).toBe(3)
  })
  
  test('focus on select component and see if options open', () => {
    document.querySelector('#test-select').focus()
    expect(document.querySelector('.selectra-options').classList.contains('open')).toBe(true)
  })
  
  test('focus on select, and click on option', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-option[data-value="option2"]').click()
    expect(document.querySelector('#test-select').val()).toBe('option2')
  })
  
  test('filter by text', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-handler').value = 'option 1'
    document.querySelector('.selectra-handler').dispatchEvent(new Event('input'))
    expect(document.querySelectorAll('.selectra-option').length).toBe(1)
    expect(document.querySelector('.selectra-option[data-value="option1"]')).not.toBeNull()
    expect(document.querySelector('.selectra-option[data-value="option2"]')).toBeNull()
  })

  test('click on disabled option', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-option[data-value="option3"]').click()
    expect(document.querySelector('#test-select').val()).toBe('option1')
  })
})

describe('simple select with search', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="test-select"><option value="option1">Option 1</option><option value="option2">Option 2</option></select>
    `
    createSelectra('#test-select', {
      search: true
    })
  })
  
  test('creates custom selector after init', () => {
    const selectraContainer = document.querySelector('.selectra-container')
    const selectraOptions = selectraContainer.querySelector('.selectra-options')
  
    expect(selectraContainer).not.toBeNull()
    expect(selectraContainer.querySelector('.selectra-handler')).not.toBeNull()
    expect(selectraOptions).not.toBeNull()
    expect(selectraOptions.classList.contains('open')).toBe(false)
    expect(selectraContainer.querySelectorAll('.selectra-option').length).toBe(2)
  })
  
  test('focus on select component and see if options open', () => {
    document.querySelector('#test-select').focus()
    expect(document.querySelector('.selectra-options').classList.contains('open')).toBe(true)
  })
  
  test('focus on select, and click on option', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-option[data-value="option2"]').click()
    expect(document.querySelector('#test-select').val()).toBe('option2')
  })
  
  test('filter by text', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-handler').value = 'option 1'
    document.querySelector('.selectra-handler').dispatchEvent(new Event('input'))
    expect(document.querySelectorAll('.selectra-option').length).toBe(1)
    expect(document.querySelector('.selectra-option[data-value="option1"]')).not.toBeNull()
    expect(document.querySelector('.selectra-option[data-value="option2"]')).toBeNull()
  })
})

describe('optgroup select', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="test-select"><optgroup label="All options"><option value="option1">Option 1</option><option value="option2">Option 2</option></optgroup></select>
    `
    createSelectra('#test-select', {
      search: true
    })
  })

  test('creates custom selector after init', () => {
    const selectraContainer = document.querySelector('.selectra-container')
    const selectraOptions = selectraContainer.querySelector('.selectra-options')
  
    expect(selectraContainer).not.toBeNull()
    expect(selectraContainer.querySelector('.selectra-handler')).not.toBeNull()
    expect(selectraOptions).not.toBeNull()
    expect(selectraOptions.classList.contains('open')).toBe(false)
    expect(selectraContainer.querySelectorAll('.selectra-option').length).toBe(2)
    expect(selectraContainer.querySelectorAll('.selectra-option-group').length).toBe(1)
  })
  
  test('filter by text', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-handler').value = 'option 1'
    document.querySelector('.selectra-handler').dispatchEvent(new Event('input'))
    expect(document.querySelectorAll('.selectra-option').length).toBe(1)
    expect(document.querySelector('.selectra-option[data-value="option1"]')).not.toBeNull()
    expect(document.querySelector('.selectra-option[data-value="option2"]')).toBeNull()
  })
})



describe('optgroup select multiple', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="test-select" multiple><optgroup label="All options"><option value="option1">Option 1</option><option value="option2">Option 2</option></optgroup></select>
    `
    createSelectra('#test-select', {
      search: true
    })
  })

  test('focus on select, and click on option', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-option[data-value="option2"]').click()
    expect(document.querySelector('#test-select').val()).toStrictEqual(['option2'])
  })

  test('focus on select, and click on both option', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-option[data-value="option1"]').click()
    document.querySelector('.selectra-option[data-value="option2"]').click()
    expect(document.querySelector('#test-select').val()).toStrictEqual(['option1', 'option2'])
  })

  test('focus on select, and click on both option, unclick an option', () => {
    document.querySelector('#test-select').focus()
    document.querySelector('.selectra-option[data-value="option1"]').click()
    document.querySelector('.selectra-option[data-value="option2"]').click()
    document.querySelector('.selectra-option[data-value="option1"]').click()
    expect(document.querySelector('#test-select').val()).toStrictEqual(['option2'])
  })
})

describe('disabled select without search', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="test-select" multiple disabled><optgroup label="All options"><option value="option1">Option 1</option><option value="option2">Option 2</option></optgroup></select>
    `
    createSelectra('#test-select')
  })

  test('disabled select, check if on click if it opens', () => {
    document.querySelector('#test-select').focus()
    expect(document.querySelector('.selectra-options').classList.contains('open')).toBe(false)
  })
})


describe('disabled select with search', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="test-select" multiple disabled><optgroup label="All options"><option value="option1">Option 1</option><option value="option2">Option 2</option></optgroup></select>
    `
    createSelectra('#test-select', {
      search: true
    })
  })

  test('disabled select, check if on click if it opens', () => {
    document.querySelector('#test-select').focus()
    expect(document.querySelector('.selectra-options').classList.contains('open')).toBe(false)
  })
})

describe('add options programmatically', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="test-select"></select>
    `
    createSelectra('#test-select', {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3', disabled: true },
        { value: 'option4', label: 'Option 4', selected: true }
      ]
    })
  })

  test('check if options are properly generated', () => {
    const selectraContainer = document.querySelector('.selectra-container')
    expect(selectraContainer.querySelectorAll('.selectra-option').length).toBe(4)
    expect(selectraContainer.querySelectorAll('.selectra-option:not([data-disabled="true"])').length).toBe(3)
    expect(document.querySelector('#test-select').val()).toBe('option4')
  })
})



describe('add option groups programmatically', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <select id="test-select" multiple></select>
    `
    createSelectra('#test-select', {
      options: [
        {
          label: 'Group 1',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2', selected: true }
          ]
        },
        {
          label: 'Group 2',
          options: [
            { value: 'option3', label: 'Option 3', disabled: true },
            { value: 'option4', label: 'Option 4', selected: true }
          ]
        }
      ]
    })
  })

  test('check if options are properly generated', () => {
    const selectraContainer = document.querySelector('.selectra-container')
    expect(selectraContainer.querySelectorAll('.selectra-option').length).toBe(4)
    expect(selectraContainer.querySelectorAll('.selectra-option:not([data-disabled="true"])').length).toBe(3)
    expect(document.querySelector('#test-select').val()).toStrictEqual(['option2', 'option4'])
  })
})
