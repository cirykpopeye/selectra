> NPM package link https://www.npmjs.com/package/selectra

# Selectra
Vanilla JS Select2 replacement, no jQuery components just pure JS.
A custom select input

## Features
- Supports **multiple**
- Supports search filter if enabled in option
- Supports **optgroup**
- Supports query selector, allows to initiate multiple selects by class
- Tabbing through input fields still triggers this custom element
- Easy to setup
- Works with frameworks such as VueJS, example included in demo

## Demo
You can view a demo using the latest files on https://cirykpopeye.github.io/selectra/

## Installation
### Package manager
```bash
npm install selectra
```
### Manual
Copy both `dist/selectra.min.css` and `dist/selectra.min.js`

## Usage
### HTML
```html
<select id="custom-select" class="form-control" multiple>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```
or
```html
<select id="custom-select" class="form-control">
  <optgroup label="Option group">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
  </optgroup>
</select>
```
### Via a bundler
```js
import Selectra, { createSelectra } from 'selectra'

const customSelect = new Selectra('#custom-select')
customSelect.init()

// or

createSelectra('#custom-select')
```
```scss
@import "selectra/src/scss/index.scss"
```

### To fetch the value
```js
// Will return option1, or ['option1', 'option2'] if multiple and both selected
document.querySelector('#custom-select').val() 
// document.querySelector('#custom-select').value can still be used, though with multiple .selectedOptions should be used, .val() simplifies this
```

### To set the value
```js
document.querySelector('#custom-select').val('option1') 
// or for multiple
document.querySelector('#custom-select').val(['option1', 'option2']) 
```

### Via script import

```html
<head>
  <link rel="stylesheet" href="<path-to-assets>/selectra.min.css">
</head>
...
<script src="<path-to-assets>/selectra.min.js"></script>
<script>
  const  customSelect = new Selectra('#custom-select', {
    search: true
  })
  customSelect.init()

  // or
  createSelectra('#custom-select', {
    search: true
  })
</script>
```

## Set options programmatically
```js
createSelectra('#custom-select', {
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]
})

// or optgroups
createSelectra('#custom-select', {
  options: [
    {
      label: 'Group 1',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
    },
    {
      label: 'Group 2',
      options: [
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' }
      ]
    }
  ]
})
```

## Options
| Option | Value | Description |
| ------ | ----- | ----------- |
| search | boolean | Transforms the button into a input field, on click options open and can be searched |
| langInputPlaceholder | string | Sets the translated value for input. **Default: Search** |
| langEmptyValuePlaceholder | string | Sets the translated value if option yet to be selected. **Default: Pick a value** |
| options | array | Array of options, or option groups

## CSS / SCSS variables
| SCSS variable | CSS variable | Default value |
| ------------- | ------------ | ------------- |
| $selectra-container-min-width | --selectra-container-min-width | 300px |
| $selectra-options-bg | --selectra-options-bg | #eee |
| $selectra-options-max-height | --selectra-options-max-height | 300px |
| $selectra-options-scrollbar-width | --selectra-options-scrollbar-width | 6px |
| $selectra-options-scrollbar-track-color | --selectra-options-scrollbar-track-color | #f1f1f1 |
| $selectra-options-scrollbar-thumb-color | --selectra-options-scrollbar-thumb-color | #888 |
| $selectra-options-scrollbar-thumb-hover-color | --selectra-options-scrollbar-thumb-hover-color | #555 |
| $selectra-options-shadow | --selectra-options-shadow | 3px 3px 3px rgba(0, 0, 0, 0.16) |
| $selectra-options-border-radius | --selectra-options-border-radius | 4px |
