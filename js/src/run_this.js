const app = require('../src/Application.js');

const basket = {
  'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
    price: 9.99,
    quantity: 1,
    discounts: [],
  },
  'b0d57b3e-246a-401b-a1be-70e195f69497': {
    price: 50.0,
    quantity: 3,
    discounts: [],
  },
  '2693be09-f914-4533-9a78-6d6477871b5d': {
    price: 29.5,
    quantity: 10,
    discounts: [],
  },
};

app.getTotalPrice(basket);
