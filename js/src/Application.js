/* eslint-disable consistent-return */
class Application {
  /* Get total price of products in basket */
  static getTotalPrice(basket, discounts) {
    if (this.isEmptyBasket(basket)) return 0;
    let total = 0;
    Object.keys(basket).forEach((productId) => {
      const discount = basket[productId].discounts.length ? this.getDiscount(basket[productId], discounts) : 0;
      total += (basket[productId].price * basket[productId].quantity) - discount;
    });
    return total;
  }

  static isEmptyBasket(basket) {
    return Object.keys(basket).length === 0;
  }

  static getDiscount(product, discounts) {

    /* A hash containing all discount types */
    const discountTypes = {
      percent: this.getPercentDiscount,
      absolute: this.getAbsoluteDiscount,
      buyNGetMFree: this.buyNGetMFree,
    };
    let totalDiscount = 0;
    const discountsList = Object.keys(discounts);

    discountsList.forEach((discountCode) => {
      const currentDiscountType = discounts[discountCode].type;
      if (this.discountHasMinimumQualifier(product, discounts[discountCode])) {
        totalDiscount += discountTypes[currentDiscountType](product, discounts[discountCode]);
      }
    })
    return totalDiscount;
  }

  static discountHasMinimumQualifier(product, discount) {
    return product.quantity >= discount.min;
  }

  static getPercentDiscount(product, discount) {
    const decimal = discount.value / 100;
    return product.price * decimal;
  }
}

module.exports = Application;


















//   /* Get comulative discount */
//   static getComulativeDiscount(basket, discounts) {
//     const basketItem = Object.keys(basket);
//     const discountItems = Object.keys(discounts);
//     let total = basket[basketItem].price;

//     /* If there isn't a comulative discount, callback to getPercentageDiscount() function */
//     if (discountItems.length === 1) return this.getPercentDiscount(basket, discounts);

//     /* If no discount is present, callback to getBasePrice() function */
//     if (discountItems.length < 1) return this.getBasePrice(basket);

//     /* Loop through each discount and applies to product price */
//     discountItems.forEach((item) => {
//       if (discounts[item].type === 'percent') {
//         const decimal = (100 - discounts[item].value) / 100;
//         total *= decimal;
//       } else {
//         total -= discounts[item].value;
//       }
//     });
//     return Math.round(total * 100) / 100;
//   }

//   /* Get absolute discount */
//   static getAbsoluteDiscount(basket, discounts) {
//     const basketItem = Object.keys(basket);
//     const discountItems = Object.keys(discounts);
//     const discountType = discounts[discountItems].type;

//     if (discountType === 'percent') {
//       return this.getPercentDiscount(basket, discounts);
//     }
//     return (basket[basketItem].price * basket[basketItem].quantity) - discounts[discountItems].value;
//   }
// }


