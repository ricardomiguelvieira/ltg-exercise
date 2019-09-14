const app = require('../src/Application.js');

const discounts = {
  'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
    type: 'percent',
    value: 15,
    min: 1,
  },
};
const basket = {
  'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
    price: 10.0,
    quantity: 1,
    discounts: ['c08200af-0fa9-45e3-a6a0-cb7bd6696d4e'],
  },
};

app.getTotalPrice(basket, discounts);
