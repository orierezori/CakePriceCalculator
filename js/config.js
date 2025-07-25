/* ===== CONFIGURATION & CONSTANTS ===== */

// Pricing constants
export const PRICING = {
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
};

// API Configuration
export const API_CONFIG = {
  AI_SUMMARY_ENDPOINT: 'https://gemini-api-worker.orierezori.workers.dev/',
  TIKKIE_PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.abnamro.nl.tikkie&hl=en',
  GOOGLE_TASKS_URL: 'https://tasks.google.com/embed/frame?'
};

// Form element IDs (for easier refactoring)
export const ELEMENT_IDS = {
  // Basic form elements
  FORM: 'cakeForm',
  TYPE: 'type',
  AMOUNT: 'amount',
  CAKE_STYLE: 'cakeStyle',
  TASTE: 'taste',
  SIZE: 'size',
  
  // Cake-specific elements
  CREAM_TOPPING: 'creamTopping',
  LAYERS: 'layers',
  NATURAL_COLORS: 'naturalColors',
  SPRINKLES: 'sprinkles',
  PIPING: 'piping',
  LETTERS: 'letters',
  CAKE_NAME: 'cakeName',
  LETTERS2: 'letters2',
  CAKE_NAME2: 'cakeName2',
  NUTS: 'nuts',
  FRUITS: 'fruits',
  COCONUT_VANILLA_CREAM: 'coconutVanillaCream',
  LAYER_FILLING: 'layerFilling',
  
  // Extras
  TOPPER1: 'topper1',
  TOPPER1_TEXT: 'topper1Text',
  TOPPER2: 'topper2',
  TOPPER2_TEXT: 'topper2Text',
  CUSTOM_ADDITION: 'customAddition',
  CUSTOM_ADDITION_TEXT: 'customAdditionText',
  CUSTOM_ADDITION_PRICE: 'customAdditionPrice',
  CUSTOM_ADDITION2: 'customAddition2',
  CUSTOM_ADDITION2_TEXT: 'customAddition2Text',
  CUSTOM_ADDITION2_PRICE: 'customAddition2Price',
  DISCOUNT: 'discount',
  DISCOUNT_AMOUNT: 'discountAmount',
  
  // Order details
  THEME: 'theme',
  PICKUP_DATE: 'pickupDate',
  ALLERGIES: 'alergies',
  
  // Output elements
  TOTAL_PRICE_OUTPUT: 'totalPriceOutput',
  ORDER_SUMMARY_OUTPUT: 'orderSummaryOutput',
  ORDER_SUMMARY_CONTAINER: 'orderSummaryOutputContainer',
  
  // Buttons
  SUMMARISE_ORDER_BTN: 'summariseOrderBtn',
  SUMMARISE_ORDER_AI_BTN: 'summariseOrderAIBtn',
  COPY_SUMMARY_BTN: 'copySummaryBtn',
  GENERATE_TIKKIE_BTN: 'generateTikkieBtn',
  ADD_TO_CALENDAR_BTN: 'addToCalendarBtn',
  ADD_TASK_BTN: 'addTaskBtn'
};

// Validation rules
export const VALIDATION = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 500,
  VALID_CAKE_SIZES: ['16', '18', '20', '22', '24'],
  VALID_CUPCAKE_SIZES: ['mini', 'regular'],
  EXPENSIVE_FILLINGS: ['lemon', 'orangemango', 'raspberry', 'strawberry'],
  PREMIUM_FILLINGS: ['freshstrawberry']
};