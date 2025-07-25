/* ===== UI VISIBILITY & INTERACTION CONTROLLER ===== */

import { VALIDATION } from './config.js';

export class UIController {
  constructor(formHandler) {
    this.formHandler = formHandler;
    this.elements = formHandler.elements;
  }

  /**
   * Update all visibility states based on current form state
   */
  updateVisibility() {
    const currentType = this.elements.TYPE?.value || 'cake';
    const prevType = this.elements.TYPE?.dataset.prevType || '';

    // Handle form reset on type change
    if (this.formHandler.resetFormFieldsOnTypeChange(currentType, prevType)) {
      this.elements.TYPE.dataset.prevType = currentType;
      this.updateTypeSpecificVisibility(currentType);
      this.updateTasteAndSizeOptions(currentType);
      this.updateConditionalFieldVisibility(currentType);
      return;
    }

    this.elements.TYPE.dataset.prevType = currentType;
    this.updateTypeSpecificVisibility(currentType);
    this.updateTasteAndSizeOptions(currentType);
    this.updateConditionalFieldVisibility(currentType);
  }

  /**
   * Show/hide elements based on cake vs cupcake selection
   * @param {string} currentType - 'cake' or 'cupcake'
   */
  updateTypeSpecificVisibility(currentType) {
    const cakeOnlyIds = [
      "cakeStyleLabel", "layersLabel", "sprinklesLabel", "pipingLabel", 
      "lettersLabel", "nameLabel", "letters2Label", "name2Label", 
      "nutsLabel", "fruitsLabel", "coconutVanillaCreamLabel", 
      "toppers1Label", "toppers2Label"
    ];
    const cupcakeOnlyIds = ["creamToppingLabel"];

    cakeOnlyIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.toggle('hidden', currentType !== 'cake');
      }
    });

    cupcakeOnlyIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.toggle('hidden', currentType !== 'cupcake');
      }
    });
  }

  /**
   * Update available taste and size options based on product type
   * @param {string} currentType - 'cake' or 'cupcake'
   */
  updateTasteAndSizeOptions(currentType) {
    // All tastes are now available for cakes
    if (this.elements.TASTE) {
      Array.from(this.elements.TASTE.options).forEach(opt => {
        opt.disabled = false;
      });
    }

    // Update size options
    if (this.elements.SIZE) {
      const validSizes = currentType === 'cake' 
        ? VALIDATION.VALID_CAKE_SIZES 
        : VALIDATION.VALID_CUPCAKE_SIZES;

      Array.from(this.elements.SIZE.options).forEach(opt => {
        const isValid = validSizes.includes(opt.value);
        opt.hidden = !isValid;
        opt.disabled = !isValid;
      });

      // Set default size if current is invalid
      if (!validSizes.includes(this.elements.SIZE.value)) {
        this.elements.SIZE.value = validSizes[0];
      }
    }
  }

  /**
   * Update conditional field visibility based on form state
   * @param {string} currentType - 'cake' or 'cupcake'
   */
  updateConditionalFieldVisibility(currentType) {
    const layersValue = parseInt(this.elements.LAYERS?.value) || 1;
    const lettersValue = this.elements.LETTERS?.value || 'no';
    const letters2Value = this.elements.LETTERS2?.value || 'no';
    const isCakeType = currentType === 'cake';

    // Layer Filling visibility
    const layerFillingLabel = document.getElementById('layerFillingLabel');
    if (layerFillingLabel) {
      layerFillingLabel.classList.toggle('hidden', !isCakeType || layersValue <= 1);
    }

    // Name Label visibility for Letters 1
    const nameLabel = document.getElementById('nameLabel');
    if (nameLabel) {
      const hideName = !isCakeType || lettersValue === 'no';
      nameLabel.classList.toggle('hidden', hideName);
      if (hideName && this.elements.CAKE_NAME) {
        this.elements.CAKE_NAME.value = '';
      }
    }

    // Name Label visibility for Letters 2
    const name2Label = document.getElementById('name2Label');
    if (name2Label) {
      const hideName2 = !isCakeType || letters2Value === 'no';
      name2Label.classList.toggle('hidden', hideName2);
      if (hideName2 && this.elements.CAKE_NAME2) {
        this.elements.CAKE_NAME2.value = '';
      }
    }

    // Topper text fields
    this.toggleTopperTextFields(isCakeType);

    // Custom Addition fields
    this.toggleCustomAdditionFields();

    // Discount field
    this.toggleDiscountField();
  }

  /**
   * Toggle visibility of topper text fields
   * @param {boolean} isCakeType - Whether current type is cake
   */
  toggleTopperTextFields(isCakeType) {
    const topper1Checked = this.elements.TOPPER1?.checked || false;
    const topper2Checked = this.elements.TOPPER2?.checked || false;

    if (this.elements.TOPPER1_TEXT) {
      this.elements.TOPPER1_TEXT.classList.toggle('hidden', !topper1Checked || !isCakeType);
      if (!topper1Checked || !isCakeType) {
        this.elements.TOPPER1_TEXT.value = '';
      }
    }

    if (this.elements.TOPPER2_TEXT) {
      this.elements.TOPPER2_TEXT.classList.toggle('hidden', !topper2Checked || !isCakeType);
      if (!topper2Checked || !isCakeType) {
        this.elements.TOPPER2_TEXT.value = '';
      }
    }
  }

  /**
   * Toggle visibility of custom addition fields
   */
  toggleCustomAdditionFields() {
    // Custom Addition 1
    const customAdditionChecked = this.elements.CUSTOM_ADDITION?.checked || false;
    if (this.elements.CUSTOM_ADDITION_TEXT) {
      this.elements.CUSTOM_ADDITION_TEXT.classList.toggle('hidden', !customAdditionChecked);
    }
    if (this.elements.CUSTOM_ADDITION_PRICE) {
      this.elements.CUSTOM_ADDITION_PRICE.classList.toggle('hidden', !customAdditionChecked);
    }
    if (!customAdditionChecked) {
      if (this.elements.CUSTOM_ADDITION_TEXT) this.elements.CUSTOM_ADDITION_TEXT.value = '';
      if (this.elements.CUSTOM_ADDITION_PRICE) this.elements.CUSTOM_ADDITION_PRICE.value = '';
    }

    // Custom Addition 2
    const customAddition2Checked = this.elements.CUSTOM_ADDITION2?.checked || false;
    if (this.elements.CUSTOM_ADDITION2_TEXT) {
      this.elements.CUSTOM_ADDITION2_TEXT.classList.toggle('hidden', !customAddition2Checked);
    }
    if (this.elements.CUSTOM_ADDITION2_PRICE) {
      this.elements.CUSTOM_ADDITION2_PRICE.classList.toggle('hidden', !customAddition2Checked);
    }
    if (!customAddition2Checked) {
      if (this.elements.CUSTOM_ADDITION2_TEXT) this.elements.CUSTOM_ADDITION2_TEXT.value = '';
      if (this.elements.CUSTOM_ADDITION2_PRICE) this.elements.CUSTOM_ADDITION2_PRICE.value = '';
    }
  }

  /**
   * Toggle visibility of discount amount field
   */
  toggleDiscountField() {
    const discountChecked = this.elements.DISCOUNT?.checked || false;
    
    if (this.elements.DISCOUNT_AMOUNT) {
      this.elements.DISCOUNT_AMOUNT.classList.toggle('hidden', !discountChecked);
      if (!discountChecked) {
        this.elements.DISCOUNT_AMOUNT.value = '';
      }
    }
  }
}