<?php

use PHPUnit\Framework\TestCase;

class ApplicationTest extends TestCase // @codingStandardsIgnoreLine
{
    public function testReturnsZeroWhenNothingInBasket()
    {
        $this->assertSame(
            0.0,
            Application::main([], [])
        );
    }

    public function testReturnsBasePriceOfProductWithoutDiscounts()
    {
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 9.99,
                'quantity'  => 1,
                'discounts' => [],
            ],
        ];
        $this->assertSame(
            9.99,
            Application::main($basket, [])
        );
    }

    public function testSumsProductPricesWithoutDiscounts()
    {
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 9.99,
                'quantity'  => 1,
                'discounts' => [],
            ],
            'b0d57b3e-246a-401b-a1be-70e195f69497' => [
                'price'     => 50.00,
                'quantity'  => 3,
                'discounts' => [],
            ],
            '2693be09-f914-4533-9a78-6d6477871b5d' => [
                'price'     => 29.50,
                'quantity'  => 10,
                'discounts' => [],
            ],
        ];
        $this->assertSame(
            9.99 + 3 * 50.00 + 10 * 29.50,
            Application::main($basket, [])
        );
    }

    public function testPercentageDiscount()
    {
        $discounts = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'type'  => 'percent',
                'value' => 15,
                'min'   => 1,
            ],
        ];
        $basket = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'price'     => 10.00,
                'quantity'  => 1,
                'discounts' => [
                    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e',
                ],
            ],
        ];
        $this->assertSame(
            8.50,
            Application::main($basket, $discounts)
        );
    }

    public function testPercentageDiscountHasMinQualifier()
    {
        $discounts = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'type'  => 'percent',
                'value' => 15,
                'min'   => 2,
            ],
        ];
        $basket = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'price'     => 10.00,
                'quantity'  => 1, // need 2 to qualify, only buying 1
                'discounts' => [
                    'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e',
                ],
            ],
        ];
        $this->assertSame(
            10.00,
            Application::main($basket, $discounts)
        );
    }

    public function testPercentageDiscountCumulative()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type'  => 'percent',
                'value' => 10,
                'min'   => 1,
            ],
            '6cb609e2-818e-40bb-9b29-8799ba328232' => [
                'type'  => 'percent',
                'value' => 5,
                'min'   => 1,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 1,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                    '6cb609e2-818e-40bb-9b29-8799ba328232',
                ],
            ],
        ];
        $this->assertSame(
            8.55, // 95% of 90% of 10.00
            Application::main($basket, $discounts)
        );
    }

    public function testAbsoluteDiscount()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type'  => 'absolute',
                'value' => 2.50,
                'min'   => 1,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 1,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            7.50,
            Application::main($basket, $discounts)
        );
    }

    public function testAbsoluteDiscountHasMinQualifier()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type'  => 'absolute',
                'value' => 2.50,
                'min'   => 3,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 2, // need 3 to qualify, only buying 2
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            20.00,
            Application::main($basket, $discounts)
        );
    }

    public function testPercentageAndAbsoluteDiscount()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type'  => 'percent',
                'value' => 10,
                'min'   => 1,
            ],
            '6cb609e2-818e-40bb-9b29-8799ba328232' => [
                'type'  => 'absolute',
                'value' => 1.25,
                'min'   => 1,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 1,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                    '6cb609e2-818e-40bb-9b29-8799ba328232',
                ],
            ],
        ];
        $this->assertSame(
            7.75,
            Application::main($basket, $discounts)
        );
    }

    public function testBuyNGetMFree()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'buyNGetMFree',
                'n'    => 2, // buy 2 ...
                'm'    => 1, // ... get 1 free
                'min'  => 3,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 3,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            20.00,
            Application::main($basket, $discounts)
        );
    }

    public function testBuyNGetMFreeWhenQuantityNotMultipleOfM()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'buyNGetMFree',
                'n'    => 2, // buy 2 ...
                'm'    => 1, // ... get 1 free
                'min'  => 3,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 4,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            20.00 + 10.00, // first three cost 20, fourth costs 10
            Application::main($basket, $discounts)
        );
    }

    public function testBuyNGetMFreeTwiceM()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'buyNGetMFree',
                'n'    => 2, // buy 2 ...
                'm'    => 1, // ... get 1 free
                'min'  => 3,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 6,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            40.00,
            Application::main($basket, $discounts)
        );
    }

    public function testBuyNGetMFree1To1()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'buyNGetMFree',
                'n'    => 1, // buy 1 ...
                'm'    => 1, // ... get 1 free
                'min'  => 2,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 10,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            50.00,
            Application::main($basket, $discounts)
        );
    }

    public function testNForThePriceOfM()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'nForThePriceOfM',
                'n'    => 4, // 4 ...
                'm'    => 3, // ... for the price of 3
                'min'  => 4,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 20.00,
                'quantity'  => 4,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            60.00,
            Application::main($basket, $discounts)
        );
    }

    public function testNForThePriceOfMWithTwoFree()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'nForThePriceOfM',
                'n'    => 5, // 5 ...
                'm'    => 3, // ... for the price of 3
                'min'  => 5,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 20.00,
                'quantity'  => 5,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            60.00,
            Application::main($basket, $discounts)
        );
    }

    public function testNForThePriceOfMWithOneLeftover()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'nForThePriceOfM',
                'n'    => 4, // 4 ...
                'm'    => 3, // ... for the price of 3
                'min'  => 4,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 20.00,
                'quantity'  => 5,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            80.00,
            Application::main($basket, $discounts)
        );
    }

    public function testNForThePriceOfMWithTwoLeftover()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'nForThePriceOfM',
                'n'    => 4, // 4 ...
                'm'    => 3, // ... for the price of 3
                'min'  => 4,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 20.00,
                'quantity'  => 6,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            100.00,
            Application::main($basket, $discounts)
        );
    }

    public function testNForThePriceOfMTwiceN()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'nForThePriceOfM',
                'n'    => 3, // 3 ...
                'm'    => 2, // ... for the price of 2
                'min'  => 3,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 6,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            40.00,
            Application::main($basket, $discounts)
        );
    }

    public function testNForThePriceOfMTwiceNWithOneLeftover()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'nForThePriceOfM',
                'n'    => 3, // 3 ...
                'm'    => 2, // ... for the price of 2
                'min'  => 3,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 7,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            50.00,
            Application::main($basket, $discounts)
        );
    }

    public function testPercentageAndNForThePriceOfM()
    {
        $discounts = [
            'f5adb2cc-31c8-47a4-ae80-f70541fa42f9' => [
                'type'  => 'percent',
                'value' => 10,
                'min'   => 1,
            ],
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type' => 'nForThePriceOfM',
                'n'    => 3, // 3 ...
                'm'    => 2, // ... for the price of 2
                'min'  => 3,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 3,
                'discounts' => [
                    'f5adb2cc-31c8-47a4-ae80-f70541fa42f9',
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
        ];
        $this->assertSame(
            18.00,
            Application::main($basket, $discounts)
        );
    }

    public function testAbsoluteDiscountAndBuyNGetMFree()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type'  => 'absolute',
                'value' => 2.50,
                'min'   => 1,
            ],
            '569ddb81-eb48-4c95-9e6f-88b7c66713b6' => [
                'type' => 'buyNGetMFree',
                'n'    => 2, // buy 2 ...
                'm'    => 1, // ... get 1 free
                'min'  => 3,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 9,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                    '569ddb81-eb48-4c95-9e6f-88b7c66713b6',
                ],
            ],
        ];
        $this->assertSame(
            6 * 7.50,
            Application::main($basket, $discounts)
        );
    }

    public function testSumsProductPricesWithVariousDiscounts()
    {
        $discounts = [
            'cd29ba8c-faf2-4493-9b6b-4b339310d82d' => [
                'type'  => 'absolute',
                'value' => 2.50,
                'min'   => 1,
            ],
            '6bab31c3-917f-4aae-9193-bdafc63c1c2d' => [
                'type'  => 'percent',
                'value' => 20,
                'min'   => 1,
            ],
            '569ddb81-eb48-4c95-9e6f-88b7c66713b6' => [
                'type' => 'buyNGetMFree',
                'n'    => 2, // buy 2 ...
                'm'    => 1, // ... get 1 free
                'min'  => 3,
            ],
            '910c9f0b-2fa4-4a54-861d-7b8f530aab6f' => [
                'type' => 'nForThePriceOfM',
                'n'    => 4, // 4 ...
                'm'    => 3, // ... for the price of 3
                'min'  => 4,
            ],
        ];
        $basket = [
            'c08200af-0fa9-45e3-a6a0-cb7bd6696d4e' => [
                'price'     => 10.00,
                'quantity'  => 1,
                'discounts' => [
                    'cd29ba8c-faf2-4493-9b6b-4b339310d82d',
                ],
            ],
            '62a44a85-b08b-47c3-8a6f-108eebbe909b' => [
                'price'     => 25.00,
                'quantity'  => 1,
                'discounts' => [
                    '6bab31c3-917f-4aae-9193-bdafc63c1c2d',
                ],
            ],
            'b0d57b3e-246a-401b-a1be-70e195f69497' => [
                'price'     => 50.00,
                'quantity'  => 3,
                'discounts' => [
                    '569ddb81-eb48-4c95-9e6f-88b7c66713b6',
                ],
            ],
            '2693be09-f914-4533-9a78-6d6477871b5d' => [
                'price'     => 30.00,
                'quantity'  => 4,
                'discounts' => [
                    '910c9f0b-2fa4-4a54-861d-7b8f530aab6f',
                ],
            ],
        ];
        $this->assertSame(
            7.50 + 20.00 + 100.00 + 90.00,
            Application::main($basket, $discounts)
        );
    }
}
