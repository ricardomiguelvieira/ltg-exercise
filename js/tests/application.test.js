/* global test, expect */

const Application = require('../src/Application');

test('returns zero when nothing in basket', () => {
  expect(Application.getTotalPrice([], [])).toBe(0.0);
});

test('returns base price of product without discounts', () => {
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 9.99,
      quantity: 1,
      discounts: [],
    },
  };
  expect(Application.getTotalPrice(basket, [])).toBe(9.99);
});

test('sums product prices without discounts', () => {
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
  expect(Application.getTotalPrice(basket, [])).toBe(9.99 + (3 * 50.0) + (10 * 29.5));
});

test('percentage discount', () => {
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
  expect(Application.getTotalPrice(basket, discounts)).toBe(8.5);
});

test('percentage discount has min qualifier', () => {
  const discounts = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      type: 'percent',
      value: 15,
      min: 2,
    },
  };
  const basket = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      price: 10.0,
      quantity: 1, // need 2 to qualify, only buying 1
      discounts: ['c08200af-0fa9-45e3-a6a0-cb7bd6696d4e'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(10.0);
});

test('percentage discount cumulative', () => {
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
  expect(Application.getTotalPrice(basket, discounts)).toBe(8.55); // 95% of 90% of 10.00
});

test('absolute discount', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'absolute',
      value: 2.5,
      min: 1,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 10.0,
      quantity: 1,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(7.5);
});

test('absolute discount has minimum qualifier', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'absolute',
      value: 2.5,
      min: 3,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 10.0,
      quantity: 2, // need 3 to qualify, only buying 2
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(20.0);
});

test('percentage and absolute discount', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'percent',
      value: 10,
      min: 1,
    },
    '6cb609e2-818e-40bb-9b29-8799ba328232': {
      type: 'absolute',
      value: 1.25,
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
  expect(Application.getTotalPrice(basket, discounts)).toBe(7.75);
});

test('buy N get M free', () => {
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
  expect(Application.getTotalPrice(basket, discounts)).toBe(20.0);
});

test('buy N get M free when quantity not multiple of M', () => {
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
      quantity: 4,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  // first three cost 20, fourth costs 10
  expect(Application.getTotalPrice(basket, discounts)).toBe(20.0 + 10.0);
});

test('buy N get M free, twice M', () => {
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
      quantity: 6,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(40.0);
});

test('buy N get M free, 1-to-1', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'buyNGetMFree',
      n: 1, // buy 1 ...
      m: 1, // ... get 1 free
      min: 2,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 10.0,
      quantity: 10,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(50.0);
});

test('N for the price of M', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'nForThePriceOfM',
      n: 4, // 4 ...
      m: 3, // ... for the price of 3
      min: 4,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 20.0,
      quantity: 4,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(60.0);
});

test('N for the price of M, with two free', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'nForThePriceOfM',
      n: 5, // 5 ...
      m: 3, // ... for the price of 3
      min: 5,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 20.0,
      quantity: 5,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(60.0);
});

test('N for the price of M, with one leftover', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'nForThePriceOfM',
      n: 4, // 4 ...
      m: 3, // ... for the price of 3
      min: 4,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 20.0,
      quantity: 5,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(80.0);
});

test('N for the price of M, with two leftover', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'nForThePriceOfM',
      n: 4, // 4 ...
      m: 3, // ... for the price of 3
      min: 4,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 20.0,
      quantity: 6,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(100.0);
});

test('N for the price of M, twice N', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'nForThePriceOfM',
      n: 3, // 3 ...
      m: 2, // ... for the price of 2
      min: 3,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 10.0,
      quantity: 6,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(40.0);
});

test('N for the price of M, twice M, with one leftover', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'nForThePriceOfM',
      n: 3, // 3 ...
      m: 2, // ... for the price of 2
      min: 3,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 10.0,
      quantity: 7,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(50.0);
});

test('percentage and N for the price of M', () => {
  const discounts = {
    'f5adb2cc-31c8-47a4-ae80-f70541fa42f9': {
      type: 'percent',
      value: 10,
      min: 1,
    },
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'nForThePriceOfM',
      n: 3, // 3 ...
      m: 2, // ... for the price of 2
      min: 3,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 10.0,
      quantity: 3,
      discounts: [
        'f5adb2cc-31c8-47a4-ae80-f70541fa42f9',
        'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
      ],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(18.0);
});

test('absolute discount and buy N get M free', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'absolute',
      value: 2.5,
      min: 1,
    },
    '569ddb81-eb48-4c95-9e6f-88b7c66713b6': {
      type: 'buyNGetMFree',
      n: 2, // buy 2 ...
      m: 1, // ... get 1 free
      min: 3,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 10.0,
      quantity: 9,
      discounts: [
        'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
        '569ddb81-eb48-4c95-9e6f-88b7c66713b6',
      ],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(6 * 7.5);
});

test('sums product prices with various discounts', () => {
  const discounts = {
    'cd29ba8c-faf2-4493-9b6b-4b339310d82d': {
      type: 'absolute',
      value: 2.5,
      min: 1,
    },
    '6bab31c3-917f-4aae-9193-bdafc63c1c2d': {
      type: 'percent',
      value: 20,
      min: 1,
    },
    '569ddb81-eb48-4c95-9e6f-88b7c66713b6': {
      type: 'buyNGetMFree',
      n: 2, // buy 2 ...
      m: 1, // ... get 1 free
      min: 3,
    },
    '910c9f0b-2fa4-4a54-861d-7b8f530aab6f': {
      type: 'nForThePriceOfM',
      n: 4, // 4 ...
      m: 3, // ... for the price of 3
      min: 4,
    },
  };
  const basket = {
    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e': {
      price: 10.0,
      quantity: 1,
      discounts: ['cd29ba8c-faf2-4493-9b6b-4b339310d82d'],
    },
    '62a44a85-b08b-47c3-8a6f-108eebbe909b': {
      price: 25.0,
      quantity: 1,
      discounts: ['6bab31c3-917f-4aae-9193-bdafc63c1c2d'],
    },
    'b0d57b3e-246a-401b-a1be-70e195f69497': {
      price: 50.0,
      quantity: 3,
      discounts: ['569ddb81-eb48-4c95-9e6f-88b7c66713b6'],
    },
    '2693be09-f914-4533-9a78-6d6477871b5d': {
      price: 30.0,
      quantity: 4,
      discounts: ['910c9f0b-2fa4-4a54-861d-7b8f530aab6f'],
    },
  };
  expect(Application.getTotalPrice(basket, discounts)).toBe(7.5 + 20.0 + 100.0 + 90.0);
});
