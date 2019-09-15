class Application {
  /**
   * @function
   * @name getTotalPrice
   * @static
   * @param {Object} basket The products in the basket.
   * @param {Object} discounts The discounts applied to the products.
   * @returns {number} The total price of the basket (including any discounts).
   * @description Main function which is called to calculate the total price of the basket.
   * Loops through each product in the basket.
   * Increments total with product's base price times quantity in basket if isEmptyBasket() false.
   * Increments total with price of product with discounts after calculating in getDiscount().
   */

  static getTotalPrice(basket, discounts) {
    if (this.isEmptyBasket(basket)) return 0;
    let total = 0;
    Object.keys(basket).forEach((productId) => {
      if (basket[productId].discounts.length) {
        total += this.getDiscount(basket[productId], basket[productId].discounts, discounts);
      } else {
        total += basket[productId].price * basket[productId].quantity;
      }
    });
    return total;
  }

  /**
   * @function
   * @name isEmptyBasket
   * @static
   * @param {Object} basket The products in the basket.
   * @returns {boolean}
   * @description Returns true if basket is empty.
   */
  static isEmptyBasket(basket) {
    return Object.keys(basket).length === 0;
  }

  /**
   * @function
   * @name getDiscount
   * @static
   * @param {Object} product A product in the basket.
   * @param {Array} appliedDiscountCodes Discount codes applied to the products.
   * @param {Object} appliedDiscountsDetails Details of discounts' applied to the products
   * @returns {number} The total price of the product (including any discounts).
   * @description Calculates discounts for a product.
   * Loop through discount codes applied to product.
   * Verify if code can be applied by calling function discountHasMinimumQualifier().
   * productTotalPrice is updated with the new product price every time a discount is applied.
   * productTotalPrice is passed as argument to the functions at every loop. This way,
   * functions calculate comulative discounts based on a new (already discounted) price.
   */
  static getDiscount(product, appliedDiscountCodes, appliedDiscountsDetails) {
    let productTotalPrice = product.price * product.quantity;

    // A hash containing all discount functions.
    const calculateDiscount = {
      percent: this.getPercentDiscount,
      absolute: this.getAbsoluteDiscount,
      buyNGetMFree: this.getBuyNGetMFreeDiscount,
      nForThePriceOfM: this.getNForThePriceOfM,
    };

    appliedDiscountCodes.forEach((code) => {
      const discountDetails = appliedDiscountsDetails[code];
      const discountType = discountDetails.type;
      if (this.discountHasMinimumQualifier(product, discountDetails)) {
        // Calls the appropriate discount function.
        productTotalPrice -= (calculateDiscount[discountType](productTotalPrice, discountDetails, product));
      }
    });
    return productTotalPrice;
  }

  /**
   * @function
   * @name discountHasMinimumQualifier
   * @static
   * @param {Object} product A product in the basket.
   * @param {Object} discount Details of discount applied to the product.
   * @returns {boolean} True if quantity of product in basket >= minimum quantity to apply discount.
   * @description Verify if product is eligible for discount.
   */
  static discountHasMinimumQualifier(product, discount) {
    return product.quantity >= discount.min;
  }

  /**
   * @function
   * @name getPercentDiscount
   * @static
   * @param {number} productTotalPrice Total price of product (with discounts if already applied).
   * @param {Object} discount Details of discount applied to the product.
   * @returns {number} Amount of discount to subtract to product's total price.
   * @description Calculates a percentage discount.
   */
  static getPercentDiscount(productTotalPrice, discount) {
    const decimal = discount.value / 100;
    return productTotalPrice * decimal;
  }

  /**
   * @function
   * @name getAbsoluteDiscount
   * @static
   * @param {Object} discount Details of discount applied to the product.
   * @param {Object} product A product in the basket.
   * @returns {number} Amount of discount to subtract to product's total price.
   * @description Calculates an absolute discount.
   */
  static getAbsoluteDiscount(productTotalPrice, discount, product) {
    return product.quantity * discount.value;
  }

  /**
   * @function
   * @name getBuyNGetMFreeDiscount
   * @static
   * @param {number} productTotalPrice Total price of product (with discounts if already applied).
   * @param {Object} discount Details of discount applied to the product.
   * @param {Object} product A product in the basket.
   * @returns {number} Amount of discount to subtract to product's total price.
   * @description Calculates a Buy N Get Me Free discount.
   */
  static getBuyNGetMFreeDiscount(productTotalPrice, discount, product) {
    // Number of times the discount will be applied based on product quantity in the basket and
    // minimum quantity for discount elegibility.
    const timesDiscountsApply = Math.floor(product.quantity / discount.min); // E.g. 7 / 3 = 2

    /**
     * A = (discount.n * (productTotalPrice / product.quantity)
     ** Price of product based on N quantity (N quantity is quantity to effectively be paid).
     * B = (discount.n - discount.m) * (productTotalPrice / product.quantity)
     ** Price of product based on M quantity free (M quantity is quantity to effectively be free).
     * Subtract B from A results in effective amount of discount.
     * Then multiply it to number of times the discount is to be applied.
     */
    return (((discount.n * (productTotalPrice / product.quantity)) - ((discount.n - discount.m) * (productTotalPrice / product.quantity)))) * timesDiscountsApply;
  }

  /**
   * @function
   * @name getNForThePriceOfM
   * @static
   * @param {number} productTotalPrice Total price of product (with discounts if already applied).
   * @param {Object} discount Details of discount applied to the product.
   * @param {Object} product A product in the basket.
   * @returns {number} Amount of discount to subtract to product's total price.
   * @description Calculates a Get N for The Price of M discount.
   */
  static getNForThePriceOfM(productTotalPrice, discount, product) {
    // Number of times the discount will be applied based on product quantity in the basket and
    // minimum quantity for discount elegibility.
    const timesDiscountsApply = Math.floor(product.quantity / discount.min);

    /**
     * A = (discount.n * (productTotalPrice / product.quantity)
     ** Price of product based on N quantity (N quantity is quantity of product to take home).
     * B = (discount.m * (productTotalPrice / product.quantity)
     ** Price of product based on M quantity (M quantity is quantity to effectively be paid).
     * Subtract B from A results in effective amount of discount.
     * Then multiply it to number of times the discount is to be applied.
    */
    return ((discount.n * (productTotalPrice / product.quantity)) - (discount.m * (productTotalPrice / product.quantity))) * timesDiscountsApply;
  }
}

module.exports = Application;
