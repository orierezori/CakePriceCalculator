/* ===== PRICE CALCULATION LOGIC ===== */

import { PRICING, VALIDATION } from './config.js';

export class PriceCalculator {
  
  /**
   * Calculate the total price based on form data
   * @param {Object} formData - The form data object
   * @returns {number} - The calculated price
   */
  static calculateTotalPrice(formData) {
    let price = 0;

    if (formData.type === 'cake') {
      price += this.calculateCakePrice(formData);
    } else if (formData.type === 'cupcake') {
      price += this.calculateCupcakePrice(formData);
    }

    // Apply custom additions
    price += this.calculateCustomAdditions(formData);

    // Apply discount
    price -= this.calculateDiscount(formData);

    // Ensure price doesn't go below zero
    return Math.max(0, price);
  }

  /**
   * Calculate cake-specific pricing
   * @param {Object} data - Form data
   * @returns {number} - Cake price
   */
  static calculateCakePrice(data) {
    let price = 0;

    // Base price by size
    price += PRICING.CAKE_BASE_PRICES[data.size] || PRICING.CAKE_BASE_PRICES['18'];

    // Layer pricing
    price += (data.layers - 1) * PRICING.CAKE.LAYER_INCREMENT;

    // Decorations
    if (data.naturalColors) price += PRICING.CAKE.NATURAL_COLORS;
    if (data.sprinkles) price += PRICING.CAKE.SPRINKLES;
    if (data.piping) {
      price += data.cakeStyle === 'classic' 
        ? PRICING.CAKE.PIPING_CLASSIC 
        : PRICING.CAKE.PIPING_CUSTOM;
    }

    // Letters pricing
    price += this.calculateLettersPrice(data.letters, data.cakeName);
    price += this.calculateLettersPrice(data.letters2, data.cakeName2);

    // Additional decorations
    if (data.nuts) price += PRICING.CAKE.NUTS;
    if (data.fruits) price += PRICING.CAKE.FRUITS;
    if (data.coconutVanillaCream) price += PRICING.CAKE.COCONUT_VANILLA_CREAM;

    // Layer fillings
    price += this.calculateLayerFillingsPrice(data);

    // Toppers
    if (data.topper1) price += PRICING.CAKE.TOPPER;
    if (data.topper2) price += PRICING.CAKE.TOPPER;

    return price;
  }

  /**
   * Calculate cupcake-specific pricing
   * @param {Object} data - Form data
   * @returns {number} - Cupcake price
   */
  static calculateCupcakePrice(data) {
    let price = 0;

    // Base price
    const unitPrice = data.size === 'mini' 
      ? PRICING.CUPCAKE.MINI 
      : PRICING.CUPCAKE.REGULAR;
    price += unitPrice * data.amount;

    // Cream topping
    if (data.creamTopping) {
      price += PRICING.CUPCAKE.CREAM_TOPPING_PER_UNIT * data.amount;
    }

    // Natural colors with tiered pricing
    if (data.naturalColors) {
      price += this.calculateCupcakeNaturalColorsPrice(data.amount);
    }

    return price;
  }

  /**
   * Calculate letters pricing
   * @param {string} lettersType - 'no', 'small', or 'big'
   * @param {string} name - The name text
   * @returns {number} - Letters price
   */
  static calculateLettersPrice(lettersType, name) {
    if (lettersType === 'no' || !name) return 0;
    
    const pricePerChar = lettersType === 'small' 
      ? PRICING.CAKE.LETTERS_SMALL_PER_CHAR 
      : PRICING.CAKE.LETTERS_BIG_PER_CHAR;
    
    return pricePerChar * name.length;
  }

  /**
   * Calculate layer fillings price
   * @param {Object} data - Form data
   * @returns {number} - Layer fillings price
   */
  static calculateLayerFillingsPrice(data) {
    if (data.layers <= 1 || !data.layerFillingValues?.length) return 0;

    const totalFillingPrice = data.layerFillingValues.reduce((sum, filling) => {
      if (VALIDATION.EXPENSIVE_FILLINGS.includes(filling)) {
        return sum + PRICING.FILLING.LEMON_ORANGE_RASPBERRY_STRAWBERRY;
      } else if (VALIDATION.PREMIUM_FILLINGS.includes(filling)) {
        return sum + PRICING.FILLING.FRESH_STRAWBERRY;
      } else {
        return sum + PRICING.FILLING.NUTS_FRUITS_OREO_LOTUS;
      }
    }, 0);

    return (data.layers - 1) * totalFillingPrice;
  }

  /**
   * Calculate cupcake natural colors tiered pricing
   * @param {number} amount - Number of cupcakes
   * @returns {number} - Natural colors price
   */
  static calculateCupcakeNaturalColorsPrice(amount) {
    if (amount <= 12) {
      return PRICING.CUPCAKE.NATURAL_COLORS_TIER1;
    } else if (amount <= 30) {
      return PRICING.CUPCAKE.NATURAL_COLORS_TIER2;
    } else {
      const additionalGroups = Math.ceil((amount - 30) / 20);
      return PRICING.CUPCAKE.NATURAL_COLORS_TIER2 + 
             (additionalGroups * PRICING.CUPCAKE.NATURAL_COLORS_ADDITIONAL_PER_20);
    }
  }

  /**
   * Calculate custom additions total
   * @param {Object} data - Form data
   * @returns {number} - Custom additions price
   */
  static calculateCustomAdditions(data) {
    let price = 0;
    
    if (data.customAddition && data.customAdditionPrice > 0) {
      price += data.customAdditionPrice;
    }
    
    if (data.customAddition2 && data.customAddition2Price > 0) {
      price += data.customAddition2Price;
    }
    
    return price;
  }

  /**
   * Calculate discount amount
   * @param {Object} data - Form data
   * @returns {number} - Discount amount
   */
  static calculateDiscount(data) {
    return (data.discount && data.discountAmount > 0) ? data.discountAmount : 0;
  }
}