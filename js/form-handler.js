/* ===== FORM HANDLING & DATA MANAGEMENT ===== */

import { ELEMENT_IDS } from './config.js';

export class FormHandler {
  constructor() {
    this.elements = this.cacheElements();
  }

  /**
   * Cache all form elements for better performance
   * @returns {Object} - Cached DOM elements
   */
  cacheElements() {
    const elements = {};
    
    // Cache each element by its ID
    Object.entries(ELEMENT_IDS).forEach(([key, id]) => {
      const element = document.getElementById(id);
      if (element) {
        elements[key] = element;
      }
    });
    
    return elements;
  }

  /**
   * Get selected option text for a select element
   * @param {HTMLSelectElement} selectElement 
   * @returns {string} - Selected option text
   */
  getSelectedOptionText(selectElement) {
    if (!selectElement || selectElement.selectedIndex === -1) return '';
    return selectElement.options[selectElement.selectedIndex].text;
  }

  /**
   * Gather all form data into a structured object
   * @returns {Object} - Complete form data
   */
  getFormData() {
    const elements = this.elements;
    
    return {
      // Basic options
      type: elements.TYPE?.value || 'cake',
      typeText: this.getSelectedOptionText(elements.TYPE),
      amount: parseInt(elements.AMOUNT?.value) || 1,
      cakeStyle: elements.CAKE_STYLE?.value || 'classic',
      cakeStyleText: this.getSelectedOptionText(elements.CAKE_STYLE),
      taste: elements.TASTE?.value || 'vanilla',
      tasteText: this.getSelectedOptionText(elements.TASTE),
      size: elements.SIZE?.value || '18',
      sizeText: this.getSelectedOptionText(elements.SIZE),
      
      // Cake decorations & layers
      creamTopping: elements.CREAM_TOPPING?.checked || false,
      layers: parseInt(elements.LAYERS?.value) || 1,
      naturalColors: elements.NATURAL_COLORS?.checked || false,
      sprinkles: elements.SPRINKLES?.checked || false,
      piping: elements.PIPING?.checked || false,
      
      // Letters and names
      letters: elements.LETTERS?.value || 'no',
      lettersText: this.getSelectedOptionText(elements.LETTERS),
      cakeName: elements.CAKE_NAME?.value.trim() || '',
      letters2: elements.LETTERS2?.value || 'no',
      letters2Text: this.getSelectedOptionText(elements.LETTERS2),
      cakeName2: elements.CAKE_NAME2?.value.trim() || '',
      
      // Additional decorations
      nuts: elements.NUTS?.checked || false,
      fruits: elements.FRUITS?.checked || false,
      coconutVanillaCream: elements.COCONUT_VANILLA_CREAM?.checked || false,
      
      // Layer fillings
      layerFillingValues: this.getMultiSelectValues(elements.LAYER_FILLING),
      layerFillingTexts: this.getMultiSelectTexts(elements.LAYER_FILLING),
      
      // Toppers
      topper1: elements.TOPPER1?.checked || false,
      topper1Text: elements.TOPPER1_TEXT?.value.trim() || '',
      topper2: elements.TOPPER2?.checked || false,
      topper2Text: elements.TOPPER2_TEXT?.value.trim() || '',
      
      // Custom additions
      customAddition: elements.CUSTOM_ADDITION?.checked || false,
      customAdditionText: elements.CUSTOM_ADDITION_TEXT?.value.trim() || '',
      customAdditionPrice: parseFloat(elements.CUSTOM_ADDITION_PRICE?.value) || 0,
      customAddition2: elements.CUSTOM_ADDITION2?.checked || false,
      customAddition2Text: elements.CUSTOM_ADDITION2_TEXT?.value.trim() || '',
      customAddition2Price: parseFloat(elements.CUSTOM_ADDITION2_PRICE?.value) || 0,
      
      // Discount
      discount: elements.DISCOUNT?.checked || false,
      discountAmount: parseFloat(elements.DISCOUNT_AMOUNT?.value) || 0,
      
      // Order details
      theme: elements.THEME?.value.trim() || '',
      pickupDate: elements.PICKUP_DATE?.value || '',
      alergies: elements.ALLERGIES?.value.trim() || '',
      
      // Total price (will be updated)
      totalPriceText: elements.TOTAL_PRICE_OUTPUT?.textContent || '€0.00'
    };
  }

  /**
   * Get selected values from a multi-select element
   * @param {HTMLSelectElement} selectElement 
   * @returns {Array} - Array of selected values
   */
  getMultiSelectValues(selectElement) {
    if (!selectElement) return [];
    return [...selectElement.options]
      .filter(option => option.selected)
      .map(option => option.value);
  }

  /**
   * Get selected texts from a multi-select element
   * @param {HTMLSelectElement} selectElement 
   * @returns {Array} - Array of selected option texts
   */
  getMultiSelectTexts(selectElement) {
    if (!selectElement) return [];
    return [...selectElement.options]
      .filter(option => option.selected)
      .map(option => option.text);
  }

  /**
   * Reset form fields when switching between cake types
   * @param {string} currentType - Current selected type
   * @param {string} prevType - Previous type
   * @returns {boolean} - Whether reset occurred
   */
  resetFormFieldsOnTypeChange(currentType, prevType) {
    if (prevType && prevType !== currentType) {
      const elements = this.elements;
      
      // Preserve non-form specific values
      const preservedValues = {
        theme: elements.THEME?.value || '',
        pickupDate: elements.PICKUP_DATE?.value || '',
        allergies: elements.ALLERGIES?.value || ''
      };

      // Reset the form
      elements.FORM?.reset();

      // Restore preserved values
      if (elements.THEME) elements.THEME.value = preservedValues.theme;
      if (elements.PICKUP_DATE) elements.PICKUP_DATE.value = preservedValues.pickupDate;
      if (elements.ALLERGIES) elements.ALLERGIES.value = preservedValues.allergies;
      
      // Reset specific fields that might not be handled by form reset
      this.resetExtrasFields();
      
      // Set type back to selected one
      if (elements.TYPE) elements.TYPE.value = currentType;
      if (elements.AMOUNT) elements.AMOUNT.value = 1;

      // Hide order summary
      if (elements.ORDER_SUMMARY_CONTAINER) {
        elements.ORDER_SUMMARY_CONTAINER.style.display = 'none';
      }
      
      return true;
    }
    return false;
  }

  /**
   * Reset extras fields specifically
   */
  resetExtrasFields() {
    const elements = this.elements;
    
    // Reset topper text fields
    if (elements.TOPPER1_TEXT) elements.TOPPER1_TEXT.value = '';
    if (elements.TOPPER2_TEXT) elements.TOPPER2_TEXT.value = '';
    
    // Reset custom addition fields
    if (elements.CUSTOM_ADDITION) elements.CUSTOM_ADDITION.checked = false;
    if (elements.CUSTOM_ADDITION_TEXT) elements.CUSTOM_ADDITION_TEXT.value = '';
    if (elements.CUSTOM_ADDITION_PRICE) elements.CUSTOM_ADDITION_PRICE.value = '';
    if (elements.CUSTOM_ADDITION2) elements.CUSTOM_ADDITION2.checked = false;
    if (elements.CUSTOM_ADDITION2_TEXT) elements.CUSTOM_ADDITION2_TEXT.value = '';
    if (elements.CUSTOM_ADDITION2_PRICE) elements.CUSTOM_ADDITION2_PRICE.value = '';
    
    // Reset coconut vanilla cream
    if (elements.COCONUT_VANILLA_CREAM) elements.COCONUT_VANILLA_CREAM.checked = false;
    
    // Reset letters 2
    if (elements.LETTERS2) elements.LETTERS2.value = 'no';
    if (elements.CAKE_NAME2) elements.CAKE_NAME2.value = '';
    
    // Reset discount
    if (elements.DISCOUNT) elements.DISCOUNT.checked = false;
    if (elements.DISCOUNT_AMOUNT) elements.DISCOUNT_AMOUNT.value = '';
  }

  /**
   * Update the total price display
   * @param {number} price - The calculated price
   */
  updateTotalPrice(price) {
    if (this.elements.TOTAL_PRICE_OUTPUT) {
      this.elements.TOTAL_PRICE_OUTPUT.textContent = `€${price.toFixed(2)}`;
    }
  }
}