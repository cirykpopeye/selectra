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
import Selectize from 'cirykpopeye/selectize.js'

new Selectize('#custom-select')
```

### Via script import

```html
<script src="../dist/selectify.js.min.js"></script>
<script>
  new Selectize('#custom-select', {
    search: true
  })
</script>
```

## Options
| Option | Description |
| ------ | ----------- |
| search | Transforms the button into a input field, on click options open and can be searched |

## Example
View the example in the `example` directory, it uses the `dist` files inside the repo.
