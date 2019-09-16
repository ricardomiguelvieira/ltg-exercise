/* Test file for console logs */

const app = require('./Application.js');

const discounts = {
  'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
    type: 'buyNGetMFree',
    n: 2, // buy 2 ...
    m: 1, // ... get 1 free
    min: 3,
  },
};
const basket = {
  'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
    price: 10.0,
    quantity: 3,
    discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
  },
};

app.getTotalPrice(basket, discounts);
