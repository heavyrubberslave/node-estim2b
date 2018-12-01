# node-estim2b

A node implementation for communicating with the 
[E-Stim Systems 2B Power Box](https://store.e-stim.co.uk/index.php?main_page=product_info&cPath=23_24&products_id=17). 

## Example

```js
const Serialport = require('serialport');
const Estim2B = require('estim2b');

const port = new Serialport('/dev/ttyUSB0');

port.on('open', function () {
   console.log('Established connection');
}).on('error', function (err) {
    console.log('Error -> ' + err.message);
});

const instance = new Estim2B(port);

instance.setMode(Estim2B.MODE_RANDOM);
```

## Tests
There are some unit tests.

```bash
$ yarn test
```
