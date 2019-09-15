const app = require('../src/Application.js');

const discounts = {
  'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
    type: 'percent',
    value: 10,
    min: 1,
  },
  '6cb609e2-818e-40bb-9b29-8799ba328232': {
    type: 'percent',
    value: 5,
    min: 1,
  },
};
const basket = {
  'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
    price: 10.0,
    quantity: 1,
    discounts: [
      'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
      '6cb609e2-818e-40bb-9b29-8799ba328232',
    ],
  },
};
app.getTotalPrice(basket, discounts);
