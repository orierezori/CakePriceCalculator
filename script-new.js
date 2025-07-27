/* ===== CAKE PRICE CALCULATOR - UNIFIED SCRIPT ===== */
/* Modular architecture without ES6 modules for file:// compatibility */

// ===== CONFIGURATION & CONSTANTS =====
const CONFIG = {
  // Pricing constants
  PRICING: {
    // Cake base prices by size
    CAKE_BASE_PRICES: {
      '16': 30,
      '18': 30,
      '20': 35,
      '22': 40,
      '24': 45
    },
    
    // Cake additional costs
    CAKE: {
      LAYER_INCREMENT: 10,
      NATURAL_COLORS: 2,
      SPRINKLES: 3,
      PIPING_CLASSIC: 7,
      PIPING_CUSTOM: 15,
      LETTERS_SMALL_PER_CHAR: 0.2,
      LETTERS_BIG_PER_CHAR: 0.5,
      NUTS: 5,
      FRUITS: 5,
      COCONUT_VANILLA_CREAM: 7,
      DRIPPING: 5,
      FLOWERS_DECORATION: 12,
      CAKE_COATING_CREAM: 10,
      TOPPER: 10
    },
    
    // Layer filling prices
    FILLING: {
      NUTS_FRUITS_OREO_LOTUS: 1.5,
      LEMON_ORANGE_RASPBERRY_STRAWBERRY: 2,
      FRESH_STRAWBERRY: 3
    },
    
    // Cupcake prices
    CUPCAKE: {
      MINI: 2,
      REGULAR: 4,
      CREAM_TOPPING_PER_UNIT: 0.5,
      NATURAL_COLORS_TIER1: 1, // up to 12
      NATURAL_COLORS_TIER2: 2, // up to 30
      NATURAL_COLORS_ADDITIONAL_PER_20: 2 // for > 30
    }
  },

  // API Configuration
  API: {
    AI_SUMMARY_ENDPOINT: 'https://gemini-api-worker.orierezori.workers.dev/',
    TIKKIE_PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.abnamro.nl.tikkie&hl=en',
    GOOGLE_TASKS_URL: 'https://tasks.google.com/embed/frame?'
  },

  // Validation rules
  VALIDATION: {
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 500,
    VALID_CAKE_SIZES: ['16', '18', '20', '22', '24'],
    VALID_CUPCAKE_SIZES: ['mini', 'regular'],
    EXPENSIVE_FILLINGS: ['lemon', 'orangemango', 'raspberry', 'strawberry'],
    PREMIUM_FILLINGS: ['freshstrawberry']
  }
};

// ===== PRICE CALCULATION CLASS =====
class PriceCalculator {
  
  static calculateTotalPrice(formData) {
    let price = 0;

    // Calculate tier-based pricing
    if (formData.tierData && formData.tierData.length > 0) {
      // Calculate price for each tier
      formData.tierData.forEach(tierData => {
        if (formData.type === 'cake') {
          price += this.calculateTierCakePrice(tierData, formData);
        } else if (formData.type === 'cupcake') {
          price += this.calculateTierCupcakePrice(tierData, formData);
        }
      });
    } else {
      // Fallback for legacy single-tier calculation
      if (formData.type === 'cake') {
        price += this.calculateCakePrice(formData);
      } else if (formData.type === 'cupcake') {
        price += this.calculateCupcakePrice(formData);
      }
    }

    // Apply global extras (decorations, toppers, custom additions)
    price += this.calculateGlobalExtras(formData);

    // Apply custom additions
    price += this.calculateCustomAdditions(formData);

    // Apply discount
    price -= this.calculateDiscount(formData);

    // Multiply by amount for cakes (cupcakes already have amount built into tier calculations)
    if (formData.type === 'cake') {
      price *= formData.amount;
    }

    // Ensure price doesn't go below zero
    return Math.max(0, price);
  }

  /**
   * Calculate price for a single tier of cake
   * @param {Object} tierData - Single tier data
   * @param {Object} globalData - Global form data
   * @returns {number} - Tier cake price
   */
  static calculateTierCakePrice(tierData, globalData) {
    let price = 0;

    // Base price by size
    price += CONFIG.PRICING.CAKE_BASE_PRICES[tierData.size] || CONFIG.PRICING.CAKE_BASE_PRICES['18'];

    // Layer pricing
    price += (tierData.layers - 1) * CONFIG.PRICING.CAKE.LAYER_INCREMENT;

    // Layer fillings for this tier
    if (tierData.layers > 1 && tierData.layerFillingValues?.length > 0) {
      const totalFillingPrice = tierData.layerFillingValues.reduce((sum, filling) => {
        if (CONFIG.VALIDATION.EXPENSIVE_FILLINGS.includes(filling)) {
          return sum + CONFIG.PRICING.FILLING.LEMON_ORANGE_RASPBERRY_STRAWBERRY;
        } else if (CONFIG.VALIDATION.PREMIUM_FILLINGS.includes(filling)) {
          return sum + CONFIG.PRICING.FILLING.FRESH_STRAWBERRY;
        } else {
          return sum + CONFIG.PRICING.FILLING.NUTS_FRUITS_OREO_LOTUS;
        }
      }, 0);
      price += (tierData.layers - 1) * totalFillingPrice;
    }

    return price;
  }

  /**
   * Calculate price for a single tier of cupcakes
   * @param {Object} tierData - Single tier data
   * @param {Object} globalData - Global form data
   * @returns {number} - Tier cupcake price
   */
  static calculateTierCupcakePrice(tierData, globalData) {
    let price = 0;

    // Base price
    const unitPrice = tierData.size === 'mini' 
      ? CONFIG.PRICING.CUPCAKE.MINI 
      : CONFIG.PRICING.CUPCAKE.REGULAR;
    price += unitPrice * globalData.amount;

    // Cream topping for this tier
    if (tierData.creamTopping) {
      price += CONFIG.PRICING.CUPCAKE.CREAM_TOPPING_PER_UNIT * globalData.amount;
    }

    return price;
  }

  /**
   * Calculate global extras that apply to the entire order
   * @param {Object} data - Global form data
   * @returns {number} - Global extras price
   */
  static calculateGlobalExtras(data) {
    let price = 0;

    // Global decorations (apply once per order)
    if (data.naturalColors) price += CONFIG.PRICING.CAKE.NATURAL_COLORS;
    if (data.sprinkles) price += CONFIG.PRICING.CAKE.SPRINKLES;
    if (data.piping) {
      price += data.cakeStyle === 'classic' 
        ? CONFIG.PRICING.CAKE.PIPING_CLASSIC 
        : CONFIG.PRICING.CAKE.PIPING_CUSTOM;
    }
    if (data.nuts) price += CONFIG.PRICING.CAKE.NUTS;
    if (data.fruits) price += CONFIG.PRICING.CAKE.FRUITS;
    if (data.coconutVanillaCream) price += CONFIG.PRICING.CAKE.COCONUT_VANILLA_CREAM;
    if (data.dripping) price += CONFIG.PRICING.CAKE.DRIPPING;
    if (data.flowersDecoration) price += CONFIG.PRICING.CAKE.FLOWERS_DECORATION;
    if (data.cakeCoatingCream) price += CONFIG.PRICING.CAKE.CAKE_COATING_CREAM;

    // Letters pricing
    price += this.calculateLettersPrice(data.letters, data.cakeName);
    price += this.calculateLettersPrice(data.letters2, data.cakeName2);

    // Toppers
    if (data.topper1) price += CONFIG.PRICING.CAKE.TOPPER;
    if (data.topper2) price += CONFIG.PRICING.CAKE.TOPPER;

    // Cupcake natural colors (applies to entire order)
    if (data.type === 'cupcake' && data.naturalColors) {
      price += this.calculateCupcakeNaturalColorsPrice(data.amount);
    }

    return price;
  }

  static calculateCakePrice(data) {
    let price = 0;

    // Base price by size
    price += CONFIG.PRICING.CAKE_BASE_PRICES[data.size] || CONFIG.PRICING.CAKE_BASE_PRICES['18'];

    // Layer pricing
    price += (data.layers - 1) * CONFIG.PRICING.CAKE.LAYER_INCREMENT;

    // Decorations
    if (data.naturalColors) price += CONFIG.PRICING.CAKE.NATURAL_COLORS;
    if (data.sprinkles) price += CONFIG.PRICING.CAKE.SPRINKLES;
    if (data.piping) {
      price += data.cakeStyle === 'classic' 
        ? CONFIG.PRICING.CAKE.PIPING_CLASSIC 
        : CONFIG.PRICING.CAKE.PIPING_CUSTOM;
    }

    // Letters pricing
    price += this.calculateLettersPrice(data.letters, data.cakeName);
    price += this.calculateLettersPrice(data.letters2, data.cakeName2);

    // Additional decorations
    if (data.nuts) price += CONFIG.PRICING.CAKE.NUTS;
    if (data.fruits) price += CONFIG.PRICING.CAKE.FRUITS;
    if (data.coconutVanillaCream) price += CONFIG.PRICING.CAKE.COCONUT_VANILLA_CREAM;

    // Layer fillings
    price += this.calculateLayerFillingsPrice(data);

    // Toppers
    if (data.topper1) price += CONFIG.PRICING.CAKE.TOPPER;
    if (data.topper2) price += CONFIG.PRICING.CAKE.TOPPER;

    return price;
  }

  static calculateCupcakePrice(data) {
    let price = 0;

    // Base price
    const unitPrice = data.size === 'mini' 
      ? CONFIG.PRICING.CUPCAKE.MINI 
      : CONFIG.PRICING.CUPCAKE.REGULAR;
    price += unitPrice * data.amount;

    // Cream topping
    if (data.creamTopping) {
      price += CONFIG.PRICING.CUPCAKE.CREAM_TOPPING_PER_UNIT * data.amount;
    }

    // Natural colors with tiered pricing
    if (data.naturalColors) {
      price += this.calculateCupcakeNaturalColorsPrice(data.amount);
    }

    return price;
  }

  static calculateLettersPrice(lettersType, name) {
    if (lettersType === 'no' || !name) return 0;
    // Remove spaces from name for price calculation
    const nameNoSpaces = name.replace(/\s+/g, '');
    const pricePerChar = lettersType === 'small' 
      ? CONFIG.PRICING.CAKE.LETTERS_SMALL_PER_CHAR 
      : CONFIG.PRICING.CAKE.LETTERS_BIG_PER_CHAR;
    return pricePerChar * nameNoSpaces.length;
  }

  static calculateLayerFillingsPrice(data) {
    if (data.layers <= 1 || !data.layerFillingValues?.length) return 0;

    const totalFillingPrice = data.layerFillingValues.reduce((sum, filling) => {
      if (CONFIG.VALIDATION.EXPENSIVE_FILLINGS.includes(filling)) {
        return sum + CONFIG.PRICING.FILLING.LEMON_ORANGE_RASPBERRY_STRAWBERRY;
      } else if (CONFIG.VALIDATION.PREMIUM_FILLINGS.includes(filling)) {
        return sum + CONFIG.PRICING.FILLING.FRESH_STRAWBERRY;
      } else {
        return sum + CONFIG.PRICING.FILLING.NUTS_FRUITS_OREO_LOTUS;
      }
    }, 0);

    return (data.layers - 1) * totalFillingPrice;
  }

  static calculateCupcakeNaturalColorsPrice(amount) {
    if (amount <= 12) {
      return CONFIG.PRICING.CUPCAKE.NATURAL_COLORS_TIER1;
    } else if (amount <= 30) {
      return CONFIG.PRICING.CUPCAKE.NATURAL_COLORS_TIER2;
    } else {
      const additionalGroups = Math.ceil((amount - 30) / 20);
      return CONFIG.PRICING.CUPCAKE.NATURAL_COLORS_TIER2 + 
             (additionalGroups * CONFIG.PRICING.CUPCAKE.NATURAL_COLORS_ADDITIONAL_PER_20);
    }
  }

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

  static calculateDiscount(data) {
    return (data.discount && data.discountAmount > 0) ? data.discountAmount : 0;
  }
}

// ===== FORM HANDLER CLASS =====
class FormHandler {
  constructor() {
    this.elements = this.cacheElements();
    this.tierElements = {};
  }

  /**
   * Cache tier-specific elements dynamically
   * @param {number} tierCount - Number of tiers
   */
  cacheTierElements(tierCount) {
    this.tierElements = {};
    
    for (let i = 1; i <= tierCount; i++) {
      this.tierElements[`tier${i}`] = {
        taste: document.getElementById(`taste${i}`),
        size: document.getElementById(`size${i}`),
        creamTopping: document.getElementById(`creamTopping${i}`),
        layers: document.getElementById(`layers${i}`),
        layerFilling: document.getElementById(`layerFilling${i}`)
      };
    }
  }

  // Save current tier form values before regeneration
  saveTierData(maxTierCount) {
    const savedData = {};
    
    for (let i = 1; i <= maxTierCount; i++) {
      const tierElements = this.tierElements?.[`tier${i}`];
      if (tierElements) {
        savedData[`tier${i}`] = {
          taste: tierElements.taste?.value || 'vanilla',
          size: tierElements.size?.value || '18',
          creamTopping: tierElements.creamTopping?.checked || false,
          layers: tierElements.layers?.value || '1',
          layerFillingValues: this.getMultiSelectValues(tierElements.layerFilling)
        };
      }
    }
    
    return savedData;
  }

  // Restore tier form values after regeneration
  restoreTierData(savedData) {
    for (const tierKey in savedData) {
      const tierElements = this.tierElements?.[tierKey];
      const savedTierData = savedData[tierKey];
      
      if (tierElements && savedTierData) {
        // Restore basic form values
        if (tierElements.taste) tierElements.taste.value = savedTierData.taste;
        if (tierElements.size) tierElements.size.value = savedTierData.size;
        if (tierElements.creamTopping) tierElements.creamTopping.checked = savedTierData.creamTopping;
        if (tierElements.layers) tierElements.layers.value = savedTierData.layers;
        
        // Restore multi-select layer filling values
        if (tierElements.layerFilling && savedTierData.layerFillingValues) {
          // Clear all selections first
          Array.from(tierElements.layerFilling.options).forEach(option => {
            option.selected = false;
          });
          
          // Restore selected values
          savedTierData.layerFillingValues.forEach(value => {
            const option = tierElements.layerFilling.querySelector(`option[value="${value}"]`);
            if (option) option.selected = true;
          });
        }
      }
    }
  }

  cacheElements() {
    return {
      FORM: document.getElementById('cakeForm'),
      TIERS: document.getElementById('tiers'),
      TYPE: document.getElementById('type'),
      AMOUNT: document.getElementById('amount'),
      CAKE_STYLE: document.getElementById('cakeStyle'),
      TASTE: document.getElementById('taste'),
      SIZE: document.getElementById('size'),
      CREAM_TOPPING: document.getElementById('creamTopping'),
      LAYERS: document.getElementById('layers'),
      NATURAL_COLORS: document.getElementById('naturalColors'),
      SPRINKLES: document.getElementById('sprinkles'),
      PIPING: document.getElementById('piping'),
      LETTERS: document.getElementById('letters'),
      CAKE_NAME: document.getElementById('cakeName'),
      LETTERS2: document.getElementById('letters2'),
      CAKE_NAME2: document.getElementById('cakeName2'),
      NUTS: document.getElementById('nuts'),
      FRUITS: document.getElementById('fruits'),
      COCONUT_VANILLA_CREAM: document.getElementById('coconutVanillaCream'),
      DRIPPING: document.getElementById('dripping'),
      FLOWERS_DECORATION: document.getElementById('flowersDecoration'),
      CAKE_COATING_CREAM: document.getElementById('cakeCoatingCream'),
      LAYER_FILLING: document.getElementById('layerFilling'),
      TOPPER1: document.getElementById('topper1'),
      TOPPER1_TEXT: document.getElementById('topper1Text'),
      TOPPER2: document.getElementById('topper2'),
      TOPPER2_TEXT: document.getElementById('topper2Text'),
      CUSTOM_ADDITION: document.getElementById('customAddition'),
      CUSTOM_ADDITION_TEXT: document.getElementById('customAdditionText'),
      CUSTOM_ADDITION_PRICE: document.getElementById('customAdditionPrice'),
      CUSTOM_ADDITION2: document.getElementById('customAddition2'),
      CUSTOM_ADDITION2_TEXT: document.getElementById('customAddition2Text'),
      CUSTOM_ADDITION2_PRICE: document.getElementById('customAddition2Price'),
      DISCOUNT: document.getElementById('discount'),
      DISCOUNT_AMOUNT: document.getElementById('discountAmount'),
      THEME: document.getElementById('theme'),
      PICKUP_DATE: document.getElementById('pickupDate'),
      ALLERGIES: document.getElementById('alergies'),
      TOTAL_PRICE_OUTPUT: document.getElementById('totalPriceOutput'),
      ORDER_SUMMARY_OUTPUT: document.getElementById('orderSummaryOutput'),
      ORDER_SUMMARY_CONTAINER: document.getElementById('orderSummaryOutputContainer'),
      SUMMARISE_ORDER_BTN: document.getElementById('summariseOrderBtn'),
      SUMMARISE_ORDER_AI_BTN: document.getElementById('summariseOrderAIBtn'),
      COPY_SUMMARY_BTN: document.getElementById('copySummaryBtn'),
      GENERATE_TIKKIE_BTN: document.getElementById('generateTikkieBtn'),
      ADD_TO_CALENDAR_BTN: document.getElementById('addToCalendarBtn'),
      ADD_TASK_BTN: document.getElementById('addTaskBtn')
    };
  }

  getSelectedOptionText(selectElement) {
    if (!selectElement || selectElement.selectedIndex === -1) return '';
    return selectElement.options[selectElement.selectedIndex].text;
  }

  getFormData() {
    const elements = this.elements;
    const tierCount = parseInt(elements.TIERS?.value) || 1;
    
    const data = {
      // Basic options
      tiers: tierCount,
      tiersText: this.getSelectedOptionText(elements.TIERS),
      type: elements.TYPE?.value || 'cake',
      typeText: this.getSelectedOptionText(elements.TYPE),
      amount: parseInt(elements.AMOUNT?.value) || 1,
      cakeStyle: elements.CAKE_STYLE?.value || 'classic',
      cakeStyleText: this.getSelectedOptionText(elements.CAKE_STYLE),
      
      // Tier-specific data
      tierData: [],
      
      // Extras & Customizations (moved from old cake decorations)
      naturalColors: elements.NATURAL_COLORS?.checked || false,
      sprinkles: elements.SPRINKLES?.checked || false,
      piping: elements.PIPING?.checked || false,
      nuts: elements.NUTS?.checked || false,
      fruits: elements.FRUITS?.checked || false,
      coconutVanillaCream: elements.COCONUT_VANILLA_CREAM?.checked || false,
      dripping: elements.DRIPPING?.checked || false,
      flowersDecoration: elements.FLOWERS_DECORATION?.checked || false,
      cakeCoatingCream: elements.CAKE_COATING_CREAM?.checked || false,
      
      // Letters and names
      letters: elements.LETTERS?.value || 'no',
      lettersText: this.getSelectedOptionText(elements.LETTERS),
      cakeName: elements.CAKE_NAME?.value.trim() || '',
      letters2: elements.LETTERS2?.value || 'no',
      letters2Text: this.getSelectedOptionText(elements.LETTERS2),
      cakeName2: elements.CAKE_NAME2?.value.trim() || '',
      
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

    // Collect tier-specific data
    for (let i = 1; i <= tierCount; i++) {
      const tierElements = this.tierElements[`tier${i}`];
      if (tierElements) {
        data.tierData.push({
          tierNumber: i,
          taste: tierElements.taste?.value || 'vanilla',
          tasteText: this.getSelectedOptionText(tierElements.taste),
          size: tierElements.size?.value || '18',
          sizeText: this.getSelectedOptionText(tierElements.size),
          creamTopping: tierElements.creamTopping?.checked || false,
          layers: parseInt(tierElements.layers?.value) || 1,
          layerFillingValues: this.getMultiSelectValues(tierElements.layerFilling),
          layerFillingTexts: this.getMultiSelectTexts(tierElements.layerFilling)
        });
      }
    }

    return data;
  }

  getMultiSelectValues(selectElement) {
    if (!selectElement) return [];
    return [...selectElement.options]
      .filter(option => option.selected)
      .map(option => option.value);
  }

  getMultiSelectTexts(selectElement) {
    if (!selectElement) return [];
    return [...selectElement.options]
      .filter(option => option.selected)
      .map(option => option.text);
  }

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
      
      // Reset specific fields
      this.resetExtrasFields();
      
      // Set type back to selected one
      if (elements.TIERS) elements.TIERS.value = 1;
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

  resetExtrasFields() {
    const elements = this.elements;
    
    // Reset various fields
    if (elements.TOPPER1_TEXT) elements.TOPPER1_TEXT.value = '';
    if (elements.TOPPER2_TEXT) elements.TOPPER2_TEXT.value = '';
    if (elements.CUSTOM_ADDITION) elements.CUSTOM_ADDITION.checked = false;
    if (elements.CUSTOM_ADDITION_TEXT) elements.CUSTOM_ADDITION_TEXT.value = '';
    if (elements.CUSTOM_ADDITION_PRICE) elements.CUSTOM_ADDITION_PRICE.value = '';
    if (elements.CUSTOM_ADDITION2) elements.CUSTOM_ADDITION2.checked = false;
    if (elements.CUSTOM_ADDITION2_TEXT) elements.CUSTOM_ADDITION2_TEXT.value = '';
    if (elements.CUSTOM_ADDITION2_PRICE) elements.CUSTOM_ADDITION2_PRICE.value = '';
    if (elements.COCONUT_VANILLA_CREAM) elements.COCONUT_VANILLA_CREAM.checked = false;
    if (elements.LETTERS2) elements.LETTERS2.value = 'no';
    if (elements.CAKE_NAME2) elements.CAKE_NAME2.value = '';
    if (elements.DISCOUNT) elements.DISCOUNT.checked = false;
    if (elements.DISCOUNT_AMOUNT) elements.DISCOUNT_AMOUNT.value = '';
  }

  updateTotalPrice(price) {
    if (this.elements.TOTAL_PRICE_OUTPUT) {
      this.elements.TOTAL_PRICE_OUTPUT.textContent = `€${price.toFixed(2)}`;
    }
  }
}

// ===== UI CONTROLLER CLASS =====
class UIController {
  constructor(formHandler) {
    this.formHandler = formHandler;
    this.elements = formHandler.elements;
    this.tierSectionsContainer = document.getElementById('tierSectionsContainer');
  }

  /**
   * Generate dynamic tier setup sections based on selected number of tiers
   * @param {number} tierCount - Number of tiers to generate
   */
  generateTierSections(tierCount) {
    if (!this.tierSectionsContainer) return;

    // Clear existing tier sections
    this.tierSectionsContainer.innerHTML = '';

    for (let i = 1; i <= tierCount; i++) {
      const fieldset = document.createElement('fieldset');
      fieldset.className = `tier-setup-section tier-${i}`;
      fieldset.id = `tierSetup${i}`;
      
      fieldset.innerHTML = `
        <legend>Tier Setup ${i}</legend>
        <label>Taste of Cake
          <select id="taste${i}">
            <option value="vanilla">Vanilla</option>
            <option value="chocolate">Chocolate</option>
            <option value="carrot">Carrot</option>
            <option value="orange">Orange</option>
            <option value="apple">Apple</option>
          </select>
        </label>
        <label>Size
          <select id="size${i}">
            <option value="16">16'' (€30.00)</option>
            <option value="18">18'' (€30.00)</option>
            <option value="20">20'' (€35.00)</option>
            <option value="22">22'' (€40.00)</option>
            <option value="24">24'' (€45.00)</option>
            <option value="mini">Mini (€2.00)</option>
            <option value="regular">Regular (€4.00)</option>
          </select>
        </label>
        <label id="creamToppingLabel${i}">Cream Topping (€0.50 per unit)
          <input type="checkbox" id="creamTopping${i}">
        </label>
        <label id="layersLabel${i}">Layers
          <select id="layers${i}">
            <option value="1">1 (Base)</option>
            <option value="2">2 (+€10.00)</option>
            <option value="3">3 (+€20.00)</option>
            <option value="4">4 (+€30.00)</option>
            <option value="5">5 (+€40.00)</option>
            <option value="6">6 (+€50.00)</option>
          </select>
        </label>
        <label id="layerFillingLabel${i}">Layer Filling
          <small class="multi-select-hint">Hold Ctrl/Cmd to select multiple options</small>
          <select id="layerFilling${i}" size="7" multiple>
            <option value="nuts">Nuts (€1.50 per layer)</option>
            <option value="fruits">Fruits (€1.50 per layer)</option>
            <option value="oreo">Oreo (€1.50 per layer)</option>
            <option value="lotus">Lotus (€1.50 per layer)</option>
            <option value="lemon">Lemon (€2.00 per layer)</option>
            <option value="orangemango">Orange Mango (€2.00 per layer)</option>
            <option value="raspberry">Raspberry (€2.00 per layer)</option>
            <option value="strawberry">Strawberry (€2.00 per layer)</option>
            <option value="freshstrawberry">Fresh Strawberry (€3.00 per layer)</option>
          </select>
        </label>
      `;
      
      this.tierSectionsContainer.appendChild(fieldset);
      
      // Add event listeners for this tier's layer changes
      const layersSelect = fieldset.querySelector(`#layers${i}`);
      if (layersSelect) {
        layersSelect.addEventListener('change', () => {
          this.updateTierLayerFillingVisibility(i);
          this.formHandler.calculateAndUpdatePrice();
        });
      }
    }
  }

  updateVisibility() {
    const currentType = this.elements.TYPE?.value || 'cake';
    const prevType = this.elements.TYPE?.dataset.prevType || '';
    const tierCount = parseInt(this.elements.TIERS?.value) || 1;
    const prevTierCount = parseInt(this.elements.TIERS?.dataset.prevTierCount) || 1;

    // Only regenerate tier sections if tier count has changed
    if (tierCount !== prevTierCount) {
      // Save existing tier data before regeneration
      const savedTierData = this.formHandler.saveTierData(Math.max(tierCount, prevTierCount));
      
      // Generate new tier sections
      this.generateTierSections(tierCount);
      this.elements.TIERS.dataset.prevTierCount = tierCount;
      
      // Ensure tier elements are cached before updating visibility
      this.formHandler.cacheTierElements(tierCount);
      
      // Restore previously saved tier data
      this.formHandler.restoreTierData(savedTierData);
      
      // Update tier-specific visibility after restoration
      this.updateTierSpecificVisibility(currentType, tierCount);
    }

    if (this.formHandler.resetFormFieldsOnTypeChange(currentType, prevType)) {
      this.elements.TYPE.dataset.prevType = currentType;
      this.updateTypeSpecificVisibility(currentType);
      this.updateTierSpecificVisibility(currentType, tierCount);
      this.updateConditionalFieldVisibility(currentType);
      return;
    }

    this.elements.TYPE.dataset.prevType = currentType;
    this.updateTypeSpecificVisibility(currentType);
    this.updateTierSpecificVisibility(currentType, tierCount);
    this.updateConditionalFieldVisibility(currentType);
  }

  /**
   * Update visibility for tier-specific elements
   * @param {string} currentType - 'cake' or 'cupcake'
   * @param {number} tierCount - Number of selected tiers
   */
  updateTierSpecificVisibility(currentType, tierCount) {
    const isCakeType = currentType === 'cake';
    
    // For each tier, update size options and show/hide cake-specific elements
    for (let i = 1; i <= tierCount; i++) {
      const tierElements = this.formHandler.tierElements[`tier${i}`];
      if (tierElements) {
        // Update size options for this tier
        this.updateSizeOptionsForTier(tierElements.size, currentType);
        
        // Show/hide cake-specific elements for this tier
        const creamToppingLabel = document.getElementById(`creamToppingLabel${i}`);
        const layersLabel = document.getElementById(`layersLabel${i}`);
        const layerFillingLabel = document.getElementById(`layerFillingLabel${i}`);
        
        if (creamToppingLabel) creamToppingLabel.classList.toggle('hidden', currentType !== 'cupcake');
        if (layersLabel) layersLabel.classList.toggle('hidden', !isCakeType);
        
        // Handle layer filling visibility based on layers selection for this tier
        if (layerFillingLabel && tierElements.layers) {
          const layersValue = parseInt(tierElements.layers.value) || 1;
          layerFillingLabel.classList.toggle('hidden', !isCakeType || layersValue <= 1);
        }
      }
    }
  }

  /**
   * Update size options for a specific tier
   * @param {HTMLSelectElement} sizeElement - The size select element
   * @param {string} currentType - 'cake' or 'cupcake'
   */
  updateSizeOptionsForTier(sizeElement, currentType) {
    if (!sizeElement) return;
    
    const validSizes = currentType === 'cake' 
      ? CONFIG.VALIDATION.VALID_CAKE_SIZES 
      : CONFIG.VALIDATION.VALID_CUPCAKE_SIZES;

    Array.from(sizeElement.options).forEach(opt => {
      const isValid = validSizes.includes(opt.value);
      opt.hidden = !isValid;
      opt.disabled = !isValid;
    });

    if (!validSizes.includes(sizeElement.value)) {
      sizeElement.value = validSizes[0];
    }
  }

  updateTypeSpecificVisibility(currentType) {
    const cakeOnlyIds = [
      "cakeStyleLabel", "layersLabel", "sprinklesLabel", "pipingLabel", 
      "lettersLabel", "nameLabel", "nutsLabel", "fruitsLabel", 
      "coconutVanillaCreamLabel", "drippingLabel", "flowersDecorationLabel", 
      "cakeCoatingCreamLabel", "toppers1Label"
    ];
    const cupcakeOnlyIds = ["creamToppingLabel"];

    // Handle basic cake/cupcake visibility
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

    // Handle cascading visibility for "2" options
    this.updateCascadingVisibility(currentType);
  }

  updateCascadingVisibility(currentType) {
    const isCakeType = currentType === 'cake';

    // Toppers 2 visibility - only show if Toppers 1 is checked
    const toppers2Label = document.getElementById('toppers2Label');
    const topper1Checked = this.elements.TOPPER1?.checked || false;
    if (toppers2Label) {
      toppers2Label.classList.toggle('hidden', !isCakeType || !topper1Checked);
      // Reset Toppers 2 if Toppers 1 is unchecked
      if (!topper1Checked && this.elements.TOPPER2) {
        this.elements.TOPPER2.checked = false;
        if (this.elements.TOPPER2_TEXT) this.elements.TOPPER2_TEXT.value = '';
      }
    }

    // Custom Addition 2 visibility - only show if Custom Addition 1 is checked
    const customAddition2Label = document.getElementById('customAddition2Label');
    const customAddition1Checked = this.elements.CUSTOM_ADDITION?.checked || false;
    if (customAddition2Label) {
      customAddition2Label.classList.toggle('hidden', !customAddition1Checked);
      // Reset Custom Addition 2 if Custom Addition 1 is unchecked
      if (!customAddition1Checked && this.elements.CUSTOM_ADDITION2) {
        this.elements.CUSTOM_ADDITION2.checked = false;
        if (this.elements.CUSTOM_ADDITION2_TEXT) this.elements.CUSTOM_ADDITION2_TEXT.value = '';
        if (this.elements.CUSTOM_ADDITION2_PRICE) this.elements.CUSTOM_ADDITION2_PRICE.value = '';
      }
    }

    // Letters on Cake 2 visibility - only show if Letters on Cake 1 is not "no"
    const letters2Label = document.getElementById('letters2Label');
    const name2Label = document.getElementById('name2Label');
    const letters1Value = this.elements.LETTERS?.value || 'no';
    const showLetters2 = isCakeType && letters1Value !== 'no';
    
    if (letters2Label) {
      letters2Label.classList.toggle('hidden', !showLetters2);
    }
    if (name2Label) {
      name2Label.classList.toggle('hidden', !showLetters2);
    }
    
    // Reset Letters 2 if Letters 1 is set to "no"
    if (letters1Value === 'no') {
      if (this.elements.LETTERS2) this.elements.LETTERS2.value = 'no';
      if (this.elements.CAKE_NAME2) this.elements.CAKE_NAME2.value = '';
    }
  }

  updateTasteAndSizeOptions(currentType) {
    // All tastes are available for cakes
    if (this.elements.TASTE) {
      Array.from(this.elements.TASTE.options).forEach(opt => {
        opt.disabled = false;
      });
    }

    // Update size options
    if (this.elements.SIZE) {
      const validSizes = currentType === 'cake' 
        ? CONFIG.VALIDATION.VALID_CAKE_SIZES 
        : CONFIG.VALIDATION.VALID_CUPCAKE_SIZES;

      Array.from(this.elements.SIZE.options).forEach(opt => {
        const isValid = validSizes.includes(opt.value);
        opt.hidden = !isValid;
        opt.disabled = !isValid;
      });

      if (!validSizes.includes(this.elements.SIZE.value)) {
        this.elements.SIZE.value = validSizes[0];
      }
    }
  }

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

    // Name Label visibility for Letters 2 (handled in cascading visibility)
    const name2Label = document.getElementById('name2Label');
    if (name2Label) {
      const showLetters2 = isCakeType && lettersValue !== 'no'; // Must depend on Letters 1
      const hideName2 = !showLetters2 || letters2Value === 'no';
      name2Label.classList.toggle('hidden', hideName2);
      if (hideName2 && this.elements.CAKE_NAME2) {
        this.elements.CAKE_NAME2.value = '';
      }
    }

    // Update cascading visibility
    this.updateCascadingVisibility(currentType);

    // Topper text fields
    this.toggleTopperTextFields(isCakeType);

    // Custom Addition fields
    this.toggleCustomAdditionFields();

    // Discount field
    this.toggleDiscountField();
  }

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

  toggleDiscountField() {
    const discountChecked = this.elements.DISCOUNT?.checked || false;
    
    if (this.elements.DISCOUNT_AMOUNT) {
      this.elements.DISCOUNT_AMOUNT.classList.toggle('hidden', !discountChecked);
      if (!discountChecked) {
        this.elements.DISCOUNT_AMOUNT.value = '';
      }
    }
  }

  updateTierLayerFillingVisibility(tierNumber) {
    const tierElements = this.formHandler.tierElements?.[`tier${tierNumber}`];
    if (!tierElements) return;

    const layerFillingLabel = document.getElementById(`layerFillingLabel${tierNumber}`);
    if (!layerFillingLabel) return;

    const currentType = this.elements.TYPE?.value || 'cake';
    const isCakeType = currentType === 'cake';
    const layersValue = parseInt(tierElements.layers?.value) || 1;

    // Show layer filling only for cakes with more than 1 layer
    layerFillingLabel.classList.toggle('hidden', !isCakeType || layersValue <= 1);

    // Clear layer filling values if hidden
    if (!isCakeType || layersValue <= 1) {
      const layerFillingSelect = tierElements.layerFilling;
      if (layerFillingSelect) {
        // Clear all selected options
        Array.from(layerFillingSelect.options).forEach(option => {
          option.selected = false;
        });
      }
    }

  }
}

// ===== SUMMARY GENERATOR CLASS =====
class SummaryGenerator {
  
  static generateStandardSummary(data) {
    let summary = `Thanks so much for your interest in our custom ${data.type === 'cake' ? '🎂 cake' : '🧁 cupcake'}! Based on your preferences, here's your order summary:\n\n`;
    summary += `📝 *Order Summary:*\n\n`;
    summary += `🏗️ *Tiers:* ${data.tiersText}\n`;
    summary += `✨ *Type:* ${data.typeText}\n`;
    summary += `🔢 *Amount:* ${data.amount}\n`;
    
    if (data.type === 'cake') {
      summary += `🎀 *Style:* ${data.cakeStyleText}\n`;
    }
    
    summary += `🍰 *Flavor:* ${data.tasteText}\n`;

    if (data.type === 'cake') {
      summary += `📏 *Size:* ${data.sizeText}\n`;
    } else {
      summary += `🧁 *Cupcake Size:* ${data.sizeText}\n`;
    }

    if (data.theme) {
      summary += `🎨 *Theme/Design:* ${data.theme}\n`;
    }

    // Add tier-specific details
    if (data.tierData && data.tierData.length > 0) {
      summary += this.generateTierSpecificSummary(data);
    }

    // Add global decorations and extras
    if (data.type === 'cake') {
      summary += this.generateGlobalCakeExtras(data);
    } else if (data.type === 'cupcake') {
      summary += this.generateCupcakeSpecificSummary(data);
    }

    // Add extras and pickup info
    summary += this.generateExtrasAndDiscountSummary(data);
    summary += this.generatePickupAndSpecialRequestsSummary(data);

    // Add total and footer
    summary += `\n💰 *Total Price:* €${data.totalPriceText}\n\n`;
    summary += `To confirm your order, please complete the payment via this Tikkie link:\n`;
    summary += `👉 <span class="tikkie-placeholder">[Tikkie link]</span>\n\n`;
    summary += `Once the payment is done, your order will be officially confirmed. If you have any questions, I'm here for you! 💬\n\n`;
    summary += `Looking forward to baking something special for you! 🎂🧁\n\n`;
    summary += `Maayan (Manu) 🩷`;
    
    return summary;
  }

  /**
   * Generate tier-specific summary details
   * @param {Object} data - Form data
   * @returns {string} - Tier details
   */
  static generateTierSpecificSummary(data) {
    let summary = '';

    data.tierData.forEach((tier, index) => {
      summary += `\n🏗️ *Tier ${tier.tierNumber} Details:*\n`;
      summary += `🍰 *Flavor:* ${tier.tasteText}\n`;
      summary += `📏 *Size:* ${tier.sizeText}\n`;
      
      if (data.type === 'cake') {
        if (tier.layers > 1) {
          summary += `겹 *Layers:* ${tier.layers}\n`;
        }
        if (tier.layerFillingTexts.length > 0 && tier.layers > 1) {
          summary += `🍰겹 *Layer Fillings:* ${tier.layerFillingTexts.join(', ')}\n`;
        }
      } else if (data.type === 'cupcake') {
        if (tier.creamTopping) {
          summary += `🍦 *Cream Topping:* Yes\n`;
        }
      }
    });

    return summary;
  }

  /**
   * Generate global cake extras (decorations that apply to entire cake)
   * @param {Object} data - Form data
   * @returns {string} - Global extras details
   */
  static generateGlobalCakeExtras(data) {
    let summary = '\n🎨 *Decorations & Extras:*\n';

    if (data.naturalColors) {
      summary += `🌿 *Natural Colors:* Yes\n`;
    }
    if (data.sprinkles) {
      summary += `✨ *Sprinkles:* Yes\n`;
    }
    if (data.piping) {
      summary += `🍥 *Cream Decoration:* Yes\n`;
    }
    if (data.letters !== 'no') {
      summary += `🔤 *Letters on Cake 1:* ${data.lettersText}\n`;
      if (data.cakeName) {
        summary += `🏷️ *Name on Cake 1:* "${data.cakeName}"\n`;
      }
    }
    if (data.letters2 !== 'no') {
      summary += `🔤 *Letters on Cake 2:* ${data.letters2Text}\n`;
      if (data.cakeName2) {
        summary += `🏷️ *Name on Cake 2:* "${data.cakeName2}"\n`;
      }
    }
    if (data.nuts) {
      summary += `🥜 *Nuts (decoration):* Yes\n`;
    }
    if (data.fruits) {
      summary += `🍓 *Fruits (decoration):* Yes\n`;
    }
    if (data.coconutVanillaCream) {
      summary += `🥥 *Coconut Vanilla Cream:* Yes\n`;
    }
    if (data.dripping) {
      summary += `💧 *Dripping:* Yes\n`;
    }
    if (data.flowersDecoration) {
      summary += `🌸 *Flowers Decoration:* Yes\n`;
    }
    if (data.cakeCoatingCream) {
      summary += `🧈 *Cake-coating Cream:* Yes\n`;
    }
    if (data.topper1) {
      summary += `🎉 *Topper 1:* Yes${data.topper1Text ? ` (${data.topper1Text})` : ''}\n`;
    }
    if (data.topper2) {
      summary += `🎊 *Topper 2:* Yes${data.topper2Text ? ` (${data.topper2Text})` : ''}\n`;
    }

    return summary;
  }

  static generateCakeSpecificSummary(data) {
    let summary = '';

    if (data.layers > 1) {
      summary += `겹 *Layers:* ${data.layers}\n`;
    }
    if (data.naturalColors) {
      summary += `🌿 *Natural Colors:* Yes\n`;
    }
    if (data.sprinkles) {
      summary += `✨ *Sprinkles:* Yes\n`;
    }
    if (data.piping) {
      summary += `🍥 *Cream Decoration:* Yes\n`;
    }
    if (data.letters !== 'no') {
      summary += `🔤 *Letters on Cake 1:* ${data.lettersText}\n`;
      if (data.cakeName) {
        summary += `🏷️ *Name on Cake 1:* "${data.cakeName}"\n`;
      }
    }
    if (data.letters2 !== 'no') {
      summary += `🔤 *Letters on Cake 2:* ${data.letters2Text}\n`;
      if (data.cakeName2) {
        summary += `🏷️ *Name on Cake 2:* "${data.cakeName2}"\n`;
      }
    }
    if (data.nuts) {
      summary += `🥜 *Nuts (decoration):* Yes\n`;
    }
    if (data.fruits) {
      summary += `🍓 *Fruits (decoration):* Yes\n`;
    }
    if (data.coconutVanillaCream) {
      summary += `🥥 *Coconut Vanilla Cream:* Yes\n`;
    }
    if (data.layerFillingTexts.length > 0 && data.layers > 1) {
      summary += `🍰겹 *Layer Fillings:* ${data.layerFillingTexts.join(', ')}\n`;
    }
    if (data.topper1) {
      summary += `🎉 *Topper 1:* Yes${data.topper1Text ? ` (${data.topper1Text})` : ''}\n`;
    }
    if (data.topper2) {
      summary += `🎊 *Topper 2:* Yes${data.topper2Text ? ` (${data.topper2Text})` : ''}\n`;
    }

    return summary;
  }

  static generateCupcakeSpecificSummary(data) {
    let summary = '';

    if (data.creamTopping) {
      summary += `🍦 *Cream Topping:* Yes\n`;
    }
    if (data.naturalColors) {
      summary += `🌿 *Natural Colors:* Yes\n`;
    }

    return summary;
  }

  static generateExtrasAndDiscountSummary(data) {
    let summary = '';

    // Custom additions
    if (data.customAddition && data.customAdditionText && data.customAdditionPrice > 0) {
      summary += `➕ *Custom Addition 1:* ${data.customAdditionText} (€${data.customAdditionPrice.toFixed(2)})\n`;
    }
    if (data.customAddition2 && data.customAddition2Text && data.customAddition2Price > 0) {
      summary += `➕ *Custom Addition 2:* ${data.customAddition2Text} (€${data.customAddition2Price.toFixed(2)})\n`;
    }

    // Discount
    if (data.discount && data.discountAmount > 0) {
      summary += `➖ *Discount Applied:* -€${data.discountAmount.toFixed(2)}\n`;
    }

    return summary;
  }

  static generatePickupAndSpecialRequestsSummary(data) {
    let summary = '';

    if (data.pickupDate) {
      const dateParts = data.pickupDate.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      summary += `🗓️ *Pickup Date:* ${formattedDate}\n`;
    } else {
      summary += `🗓️ *Pickup Date:* _Not specified_\n`;
    }

    if (data.alergies) {
      summary += `⚠️ *Allergies/Special Requests:* ${data.alergies}\n`;
    }

    return summary;
  }

  static generateAIPrompt(data) {
    let promptString = `You are a helpful assistant specialized in summarizing cake orders for customers.

Based on the following information, generate a concise and friendly summary of the order.
Include all relevant details about the cake, such as tiers, type, amount, flavor, size, and decorations.
Also, include the pickup date, any allergies or special requests, and the total price.

Tiers: ${data.tiers}
Type: ${data.type}
Amount: ${data.amount}
`;

    // Handle tiered data for cakes and cupcakes
    if (Array.isArray(data.tierData) && data.tierData.length > 0) {
      data.tierData.forEach((tier, idx) => {
        promptString += `\nTier ${tier.tierNumber} Details:\n`;
        promptString += `Flavor: ${tier.tasteText}\n`;
        promptString += `Size: ${tier.sizeText}\n`;
        if (data.type === 'cake') {
          promptString += `Layers: ${tier.layers}\n`;
          if (Array.isArray(tier.layerFillingTexts) && tier.layerFillingTexts.length > 0 && tier.layers > 1) {
            promptString += `Layer Fillings: ${tier.layerFillingTexts.join(', ')}\n`;
          }
        } else if (data.type === 'cupcake') {
          if (tier.creamTopping) promptString += `Cream Topping: Yes\n`;
        }
      });
    }

    if (data.type === 'cake') {
      promptString += `Cake Style: ${data.cakeStyle}\n`;
      if (data.naturalColors) promptString += `Natural Colors: Yes\n`;
      if (data.sprinkles) promptString += `Sprinkles: Yes\n`;
      if (data.piping) promptString += `Cream Decoration: Yes\n`;
      if (data.letters && data.letters !== 'no') {
        promptString += `Letters on Cake 1: ${data.letters}\n`;
        if (data.cakeName) promptString += `Name on Cake 1: "${data.cakeName}"\n`;
      }
      if (data.letters2 && data.letters2 !== 'no') {
        promptString += `Letters on Cake 2: ${data.letters2}\n`;
        if (data.cakeName2) promptString += `Name on Cake 2: "${data.cakeName2}"\n`;
      }
      if (data.nuts) promptString += `Nuts (decoration): Yes\n`;
      if (data.fruits) promptString += `Fruits (decoration): Yes\n`;
      if (data.coconutVanillaCream) promptString += `Coconut Vanilla Cream: Yes\n`;
      if (data.dripping) promptString += `Dripping: Yes\n`;
      if (data.flowersDecoration) promptString += `Flowers Decoration: Yes\n`;
      if (data.cakeCoatingCream) promptString += `Cake-coating Cream: Yes\n`;
      if (data.topper1) {
        promptString += `Topper 1: Yes${data.topper1Text ? ` (${data.topper1Text})` : ''}\n`;
      }
      if (data.topper2) {
        promptString += `Topper 2: Yes${data.topper2Text ? ` (${data.topper2Text})` : ''}\n`;
      }
    } else if (data.type === 'cupcake') {
      if (data.naturalColors) promptString += `Natural Colors: Yes\n`;
    }

    // Add global taste/size for legacy support (single-tier forms)
    if (data.taste) promptString += `Taste: ${data.taste}\n`;
    if (data.size) promptString += `Size: ${data.size}\n`;

    if (data.theme) promptString += `Theme/Design: ${data.theme}\n`;
    if (data.pickupDate) {
      const dateParts = data.pickupDate.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      promptString += `Pickup Date: ${formattedDate}\n`;
    }
    if (data.alergies) promptString += `Allergies/Special Requests: ${data.alergies}\n`;

    promptString += `Total Price: €${data.totalPriceText}\n`;

    // Add custom additions
    if (data.customAddition && data.customAdditionText && data.customAdditionPrice > 0) {
      promptString += `Custom Addition 1: ${data.customAdditionText} (€${data.customAdditionPrice.toFixed(2)})\n`;
    }
    if (data.customAddition2 && data.customAddition2Text && data.customAddition2Price > 0) {
      promptString += `Custom Addition 2: ${data.customAddition2Text} (€${data.customAddition2Price.toFixed(2)})\n`;
    }

    // Add discount
    if (data.discount && data.discountAmount > 0) {
      promptString += `Discount Applied: -€${data.discountAmount.toFixed(2)}\n`;
    }

    return promptString;
  }

  static async callAISummaryAPI(promptString) {
    const response = await fetch(CONFIG.API.AI_SUMMARY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: promptString }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}. Response: ${errorData}`);
    }

    const result = await response.json();
    if (!result || !result.response) {
      throw new Error('Failed to get a valid summary from AI. Response structure might be incorrect.');
    }

    return result.response;
  }

  static formatAIResponse(aiResponse) {
    let formattedResponse = aiResponse;
    formattedResponse += `\n\nTo confirm your order, please complete the payment via the Tikkie link below.\n`;
    formattedResponse += `Once the payment is done, your order will be officially confirmed. If you have any questions, I'm here for you! 💬\n\n`;
    formattedResponse += `Looking forward to baking something special for you! 🎂🧁\n\n`;
    formattedResponse += `Maayan (Manu) 🩷\n`;
    formattedResponse += `Payment Link:\n\n`;
    formattedResponse += `<span class="tikkie-placeholder">[Tikkie link]</span>`;
    
    return formattedResponse;
  }
}

// ===== MAIN APPLICATION CLASS =====
class CakePriceCalculatorApp {
  constructor() {
    this.formHandler = new FormHandler();
    this.uiController = new UIController(this.formHandler);
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    
    // Initialize with default single tier
    this.uiController.generateTierSections(1);
    this.formHandler.elements.TIERS.dataset.prevTierCount = 1;
    this.formHandler.cacheTierElements(1);
    
    this.setupEventListeners();
    this.updateVisibilityAndPrice();
    this.isInitialized = true;
  }

  setupEventListeners() {
    // Form change events
    if (this.formHandler.elements.FORM) {
      this.formHandler.elements.FORM.addEventListener('change', () => {
        this.updateVisibilityAndPrice();
      });
    }

    // Summary generation buttons
    this.setupSummaryButtons();
    
    // Action buttons
    this.setupActionButtons();

    // Tikkie placeholder click handler
    this.setupTikkiePlaceholderHandler();
  }

  updateVisibilityAndPrice() {
    this.uiController.updateVisibility();
    this.calculateAndUpdatePrice();
  }

  calculateAndUpdatePrice() {
    const formData = this.formHandler.getFormData();
    const price = PriceCalculator.calculateTotalPrice(formData);
    this.formHandler.updateTotalPrice(price);
  }

  setupSummaryButtons() {
    // Standard summary button
    if (this.formHandler.elements.SUMMARISE_ORDER_BTN) {
      this.formHandler.elements.SUMMARISE_ORDER_BTN.addEventListener('click', () => {
        this.generateStandardSummary();
      });
    }

    // AI summary button
    if (this.formHandler.elements.SUMMARISE_ORDER_AI_BTN) {
      this.formHandler.elements.SUMMARISE_ORDER_AI_BTN.addEventListener('click', () => {
        this.generateAISummary();
      });
    }
  }

  generateStandardSummary() {
    this.calculateAndUpdatePrice();
    const formData = this.formHandler.getFormData();
    const summaryText = SummaryGenerator.generateStandardSummary(formData);
    
    if (this.formHandler.elements.ORDER_SUMMARY_OUTPUT) {
      this.formHandler.elements.ORDER_SUMMARY_OUTPUT.innerHTML = summaryText;
    }
    if (this.formHandler.elements.ORDER_SUMMARY_CONTAINER) {
      this.formHandler.elements.ORDER_SUMMARY_CONTAINER.style.display = 'block';
    }
  }

  async generateAISummary() {
    const aiBtn = this.formHandler.elements.SUMMARISE_ORDER_AI_BTN;
    const outputContainer = this.formHandler.elements.ORDER_SUMMARY_CONTAINER;
    const output = this.formHandler.elements.ORDER_SUMMARY_OUTPUT;

    if (!aiBtn || !outputContainer || !output) return;

    try {
      // Update UI for loading state
      aiBtn.disabled = true;
      aiBtn.innerHTML = '<span class="icon">🤖</span> Generating...';
      output.innerHTML = 'Generating AI summary, please wait...';
      outputContainer.style.display = 'block';

      // Get current data and generate prompt
      this.calculateAndUpdatePrice();
      const formData = this.formHandler.getFormData();
      const promptString = SummaryGenerator.generateAIPrompt(formData);

      // Call AI API
      const aiResponse = await SummaryGenerator.callAISummaryAPI(promptString);
      const formattedResponse = SummaryGenerator.formatAIResponse(aiResponse);
      
      output.innerHTML = formattedResponse;

    } catch (error) {
      console.error('Error calling AI summary API:', error);
      output.innerHTML = `Error generating AI summary: ${error.message}. <br><br>Make sure the API endpoint is correct and the server is running.`;
    } finally {
      // Reset button state
      aiBtn.disabled = false;
      aiBtn.innerHTML = '<span class="icon">🤖</span> Summarise Order AI';
    }
  }

  setupActionButtons() {
    // Copy summary button
    if (this.formHandler.elements.COPY_SUMMARY_BTN) {
      this.formHandler.elements.COPY_SUMMARY_BTN.addEventListener('click', () => {
        this.copySummaryToClipboard();
      });
    }

    // Generate Tikkie button
    if (this.formHandler.elements.GENERATE_TIKKIE_BTN) {
      this.formHandler.elements.GENERATE_TIKKIE_BTN.addEventListener('click', () => {
        window.open(CONFIG.API.TIKKIE_PLAY_STORE_URL, '_blank');
      });
    }

    // Add to calendar button
    if (this.formHandler.elements.ADD_TO_CALENDAR_BTN) {
      this.formHandler.elements.ADD_TO_CALENDAR_BTN.addEventListener('click', () => {
        this.addToCalendar();
      });
    }

    // Add task button
    if (this.formHandler.elements.ADD_TASK_BTN) {
      this.formHandler.elements.ADD_TASK_BTN.addEventListener('click', () => {
        this.addTask();
      });
    }
  }

  async copySummaryToClipboard() {
    const output = this.formHandler.elements.ORDER_SUMMARY_OUTPUT;
    const copyBtn = this.formHandler.elements.COPY_SUMMARY_BTN;
    
    if (!output || !copyBtn) return;

    const summaryText = output.textContent;
    
    if (navigator.clipboard && summaryText) {
      try {
        await navigator.clipboard.writeText(summaryText);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. Please try manually.');
      }
    } else {
      alert('Clipboard API not available or no summary to copy.');
    }
  }

  addToCalendar() {
    const data = this.formHandler.getFormData();
    
    if (!data.pickupDate) {
      alert("Please select a pickup date first.");
      return;
    }

    const eventTitle = `${data.typeText} Pickup${data.theme ? " " + data.theme : ""}`;
    const baseDate = data.pickupDate.replace(/-/g, '');
    const startTime = '120000';
    const endTime = '130000';
    const calendarStartDate = baseDate + 'T' + startTime;
    const calendarEndDate = baseDate + 'T' + endTime;

    let eventDetails = `Order Summary:\nTiers: ${data.tiersText}\nType: ${data.typeText}\nAmount: ${data.amount}\nFlavor: ${data.tasteText}\n`;
    
    if (data.type === 'cake') {
      eventDetails += `Style: ${data.cakeStyleText}\nSize: ${data.sizeText}\nLayers: ${data.layers}\n`;
    } else {
      eventDetails += `Cupcake Size: ${data.sizeText}\n`;
    }
    
    if (data.theme) eventDetails += `Theme: ${data.theme}\n`;
    if (data.cakeName) eventDetails += `Name on Cake 1: ${data.cakeName}\n`;
    if (data.cakeName2) eventDetails += `Name on Cake 2: ${data.cakeName2}\n`;
    if (data.alergies) eventDetails += `Allergies/Requests: ${data.alergies}\n`;
    eventDetails += `Total Price: €${data.totalPriceText}`;

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${calendarStartDate}/${calendarEndDate}&details=${encodeURIComponent(eventDetails)}`;
    
    window.open(calendarUrl, '_blank');
  }

  addTask() {
    const data = this.formHandler.getFormData();

    const taskTitle = `Cake Order: ${data.theme || (data.typeText + (data.type === 'cake' ? ' Cake' : ' Cupcakes'))}`;
    
    let taskDetails = `Tiers: ${data.tiersText}\nType: ${data.typeText}\nAmount: ${data.amount}\nFlavor: ${data.tasteText}\n`;
    
    if (data.type === 'cake') {
      taskDetails += `Style: ${data.cakeStyleText}\nSize: ${data.sizeText}\nLayers: ${data.layers}\n`;
    } else {
      taskDetails += `Cupcake Size: ${data.sizeText}\n`;
    }
    
    if (data.theme) taskDetails += `Theme: ${data.theme}\n`;
    if (data.cakeName) taskDetails += `Name on Cake 1: ${data.cakeName}\n`;
    if (data.cakeName2) taskDetails += `Name on Cake 2: ${data.cakeName2}\n`;
    if (data.alergies) taskDetails += `Allergies/Requests: ${data.alergies}\n`;
    
    if (data.pickupDate) {
      const dateParts = data.pickupDate.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      taskDetails += `Pickup Date: ${formattedDate}\n`;
    }
    
    taskDetails += `Total Price: €${data.totalPriceText}\n\n`;
    taskDetails += "Order Details copied to clipboard. Please paste into Google Tasks in your 'Work Manu Vegan' list.";

    const textToCopy = `Title: ${taskTitle}\n\nDetails:\n${taskDetails}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          alert("Task details copied to clipboard! Opening Google Tasks. Please create a new task in your 'Work Manu Vegan' list and paste the details.");
          window.open(CONFIG.API.GOOGLE_TASKS_URL, '_blank');
        })
        .catch(err => {
          console.error('Failed to copy task details: ', err);
          alert('Failed to copy task details. Please try manually. Opening Google Tasks.');
          window.open(CONFIG.API.GOOGLE_TASKS_URL, '_blank');
        });
    } else {
      alert('Clipboard API not available. Opening Google Tasks. Please manually copy details.');
      window.open(CONFIG.API.GOOGLE_TASKS_URL, '_blank');
      prompt("Copy these details for your task:", textToCopy);
    }
  }

  setupTikkiePlaceholderHandler() {
    const output = this.formHandler.elements.ORDER_SUMMARY_OUTPUT;
    
    if (output) {
      output.addEventListener('click', (event) => {
        let targetElement = event.target;
        if (targetElement.classList.contains('tikkie-placeholder')) {
          event.preventDefault();
          const currentText = targetElement.textContent;
          const newLink = prompt("Please paste your Tikkie link here:",
            (currentText !== '[Tikkie link]' && currentText.startsWith("http")) ? currentText : "https://");

          if (newLink !== null && newLink.trim() !== "" && newLink.trim() !== "https://") {
            targetElement.textContent = newLink.trim();
          } else if (newLink !== null && (newLink.trim() === "" || newLink.trim() === "https://")) {
            alert("No valid link was entered. The placeholder remains unchanged.");
            if (newLink.trim() === "") targetElement.textContent = '[Tikkie link]';
          }
        }
      });
    }
  }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
  const app = new CakePriceCalculatorApp();
  app.init();
});