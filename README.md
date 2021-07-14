> NPM package link https://www.npmjs.com/package/@cirykpopeye/selectize.js

# Selectize.js
Vanilla JS Select2 replacement, no jQuery components just pure JS.
A custom select input

## Features
- Supports **multiple**
- Supports search filter if enabled in option
- Supports **optgroup**
- Supports query selector, allows to initiate multiple selects by class
- Tabbing through input fields still triggers this custom element
- Easy to setup

## Demo
You can view a demo using the latest files on https://cirykpopeye.github.io/selectize.js/

## Installation
### Package manager
```bash
npm install @cirykpopeye/selectize.js
```
### Manual
Copy both `dist/selectize.js.min.css` and `dist/selectize.js.min.js`

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
import Selectize, { createSelectize } from '@cirykpopeye/selectize.js'

const customSelect = new Selectize('#custom-select')
customSelect.init()

// or

createSelectize('#custom-select')
```
```scss
@import "@cirykpopeye/selectize.js/src/scss/index.scss"
```

### Via script import

```html
<head>
  <link rel="stylesheet" href="<path-to-assets>/selectify.js.min.css">
</head>
...
<script src="<path-to-assets>/selectify.js.min.js"></script>
<script>
  const  customSelect = new Selectize('#custom-select', {
    search: true
  })
  customSelect.init()

  // or
  createSelectize('#custom-select', {
    search: true
  })
</script>
```

## Options
| Option | Value | Description |
| ------ | ----- | ----------- |
| search | boolean | Transforms the button into a input field, on click options open and can be searched |
| langInputPlaceholder | string | Sets the translated value for input. **Default: Search** |
| langEmptyValuePlaceholder | string | Sets the translated value if option yet to be selected. **Default: Pick a value** |
