/* eslint-disable consistent-return */
class Application {
  static isEmptyBasket(basket) {
    return Object.keys(basket).length;
  }

  /* Get base price for a single product */
  static getBasePrice(basket) {
    const productId = Object.keys(basket);
    return basket[productId].price;
  }

  /* Get total price of products in basket */
  static getTotalPrice(basket) {
    let total = 0;
    Object.keys(basket).forEach((productId) => {
      total += basket[productId].price * basket[productId].quantity;
    });
    return total;
  }

  /*
    Get price with percentage discount
    ISSUE: What if there's more than one object in the basket?
    ISSUE: If no object?
  */
  static getPercentDiscount(basket, discounts) {
    const basketItems = Object.keys(basket);
    const discountsItem = Object.keys(discounts);

    /* If there's a comulative discount, callback to getComulativeDiscount() function */
    if (discountsItem.length > 1) return this.getComulativeDiscount(basket, discounts);

    /* If no discount is present, callback to getBasePrice() function */
    if (discountsItem.length < 1) return this.getTotalPrice(basket);

    const decimal = discounts[discountsItem].value / 100;
    return basket[basketItems].price - (basket[basketItems].price * decimal);
  }

  /*
    Check if it qualifies for discount based on product quantity in basket.
    Function reused for both percentage and absolute discount types.
  */
  static discountHasMinimumQualifier(basket, discounts) {
    const basketItem = Object.keys(basket);
    const discountItem = Object.keys(discounts);
    const discountType = discounts[discountItem].type;

    const discountMap = {
      percent: this.getPercentDiscount,
      absolute: this.getAbsoluteDiscount,
    };

    if (basket[basketItem].quantity < discounts[discountItem].min) return this.getTotalPrice(basket);
    return discountMap[discountType] ? discountMap[discountType](basket, discounts) : this.getTotalPrice(basket);
  }

  /* Get comulative discount */
  static getComulativeDiscount(basket, discounts) {
    const basketItem = Object.keys(basket);
    const discountItems = Object.keys(discounts);
    let total = basket[basketItem].price;

    /* If there isn't a comulative discount, callback to getPercentageDiscount() function */
    if (discountItems.length === 1) return this.getPercentDiscount(basket, discounts);

    /* If no discount is present, callback to getBasePrice() function */
    if (discountItems.length < 1) return this.getBasePrice(basket);

    /* Loop through each discount and applies to product price */
    discountItems.forEach((item) => {
      if (discounts[item].type === 'percent') {
        const decimal = (100 - discounts[item].value) / 100;
        total *= decimal;
      } else {
        total -= discounts[item].value;
      }
    });
    return Math.round(total * 100) / 100;
  }

  /* Get absolute discount */
  static getAbsoluteDiscount(basket, discounts) {
    const basketItem = Object.keys(basket);
    const discountItems = Object.keys(discounts);
    const discountType = discounts[discountItems].type;

    if (discountType === 'percent') {
      return this.getPercentDiscount(basket, discounts);
    }
    return (basket[basketItem].price * basket[basketItem].quantity) - discounts[discountItems].value;
  }
}

module.exports = Application;
