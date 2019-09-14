class Application {
  /* Get total price of products in basket */
  static getTotalPrice(basket, discounts) {
    if (this.isEmptyBasket(basket)) return 0;
    let total = 0;
    let discountedPrice = 0;
    Object.keys(basket).forEach((productId) => {
      if (basket[productId].discounts.length) {
        discountedPrice = this.getDiscount(basket[productId], discounts);
        total += discountedPrice;
      } else {
        total += basket[productId].price * basket[productId].quantity;
      }
    });
    return total;
  }

  static isEmptyBasket(basket) {
    return Object.keys(basket).length === 0;
  }

  static getDiscount(product, discounts) {
    let totalDiscount = 0;
    let productPrice = product.price;
    const productQuantity = product.quantity;

    /* A hash containing all discount types */
    const discountTypes = {
      percent: this.getPercentDiscount,
      absolute: this.getAbsoluteDiscount,
      buyNGetMFree: this.getBuyNGetNFreeDiscount,
      nForThePriceOfM: this.getNForThePriceOfM,
    };

    const discountsList = Object.keys(discounts);

    discountsList.forEach((discountCode) => {
      const currentDiscountType = discounts[discountCode].type;
      if (this.discountHasMinimumQualifier(product, discounts[discountCode])) {
        totalDiscount = (discountTypes[currentDiscountType](productPrice, discounts[discountCode], product));
      }
      productPrice = (productPrice * productQuantity) - totalDiscount;
    });
    return productPrice;
  }

  static discountHasMinimumQualifier(product, discount) {
    return product.quantity >= discount.min;
  }

  static getPercentDiscount(productPrice, discount) {
    const decimal = discount.value / 100;
    return productPrice * decimal;
  }

  static getAbsoluteDiscount(productPrice, discount) {
    return discount.value;
  }

  static getBuyNGetNFreeDiscount(productPrice, discount, product) {
    const timesDiscountsApply = Math.floor(product.quantity / discount.min);
    return (((discount.n * product.price) - (discount.n - discount.m)) * product.price) * timesDiscountsApply;
  }

  static getNForThePriceOfM(productPrice, discount, product) {
    const timesDiscountsApply = Math.floor(product.quantity / discount.min);
    return ((product.price * discount.n) - (product.price * discount.m)) * timesDiscountsApply;
  }
}

module.exports = Application;
