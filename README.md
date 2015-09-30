# Autofill event polyfill

*This is a fork of [autofill-event](https://github.com/tbosch/autofill-event) by TBosch. That shim depends on jQuery on the page this fork does not*

This is a polyfill that fires change events when browsers autofill form fields without firing a change event.

## Install

* `npm install vanilla-autofill-event`

## Usage

Add the script `autofill-event.js`,

This will do the following:

- after DOMContentLoaded: check all input fields
- a field is left: check all other fields in the same form

```js
document.querySelector('input').addEventListener('change', function(event) {
  console.log('Got a CHANGE');
});
```

## How it works

1. Remember all changes to input elements by the user (listening for change events)
and also by JavaScript.
That changed value is stored on the element in a private property.

2. Checking an element for auto fill:
Compare the current `value` of the element with the remembered value. If it's different,
trigger a change event.

## Tests

Unit tests

  1. `npm install`
  1. `npm test`

Manual Tests

  1. `npm install`
  1. `scripts/webserver.js`
  1. open the [manual runner](http://localhost:8000/index.html) and follow instructions

Notes:

  * They need to be run with a webserver and without iframes, otherwise Chrome would not autofill username/password

