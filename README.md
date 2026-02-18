⚠️ **The code of this repository has been integrated into the [SlvCtrl+](https://github.com/SlvCtrlPlus) project.**

# node-estim2b

[![CircleCI](https://circleci.com/gh/heavyrubberslave/node-estim2b.svg?style=svg)](https://circleci.com/gh/heavyrubberslave/node-estim2b)

A node implementation for communicating with the 
[E-Stim Systems 2B Power Box](https://store.e-stim.co.uk/index.php?main_page=product_info&cPath=23_24&products_id=17). 

## Example

```js
const Serialport = require('serialport');
const Readline = require('@serialport/parser-readline');
const Estim2B = require('estim2b');

const port = new Serialport('/dev/ttyUSB0');

port.on('open', function () {
   console.log('Established connection');
}).on('error', function (err) {
    console.log('Error -> ' + err.message);
});

const instance = new Estim2B(port, new Readline());

instance.setMode(Estim2B.MODE_RANDOM);
```

## Tests
There are some unit tests.

```bash
$ yarn test
```
