const app = require('../src/Application.js');

const discounts = {
  'f5adb2cc-31c8-47a4-ae80-f70541fa42f9': {
    type: 'percent',
    value: 10,
    min: 1,
  },
  // 'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
  //   type: 'nForThePriceOfM',
  //   n: 3, // 3 ...
  //   m: 2, // ... for the price of 2
  //   min: 3,
  // },
};
const basket = {
  'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
    price: 10.0,
    quantity: 3,
    discounts: [
      'f5adb2cc-31c8-47a4-ae80-f70541fa42f9',
      // 'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
    ],
  },
};

app.getTotalPrice(basket, discounts);
