/* ===== ORDER SUMMARY GENERATION ===== */

import { API_CONFIG } from './config.js';

export class SummaryGenerator {
  
  /**
   * Generate standard order summary text
   * @param {Object} data - Form data
   * @returns {string} - Formatted summary text
   */
  static generateStandardSummary(data) {
    let summary = `Thanks so much for your interest in our custom ${data.type === 'cake' ? '🎂 cake' : '🧁 cupcake'}! Based on your preferences, here's your order summary:\n\n`;
    summary += `📝 *Order Summary:*\n\n`;
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

    // Add cake-specific details
    if (data.type === 'cake') {
      summary += this.generateCakeSpecificSummary(data);
    } else if (data.type === 'cupcake') {
      summary += this.generateCupcakeSpecificSummary(data);
    }

    // Add custom additions and discount
    summary += this.generateExtrasAndDiscountSummary(data);

    // Add pickup information
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
   * Generate cake-specific summary details
   * @param {Object} data - Form data
   * @returns {string} - Cake details
   */
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

  /**
   * Generate cupcake-specific summary details
   * @param {Object} data - Form data
   * @returns {string} - Cupcake details
   */
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

  /**
   * Generate extras and discount summary
   * @param {Object} data - Form data
   * @returns {string} - Extras and discount details
   */
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

  /**
   * Generate pickup and special requests summary
   * @param {Object} data - Form data
   * @returns {string} - Pickup and special requests details
   */
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

  /**
   * Generate AI prompt for summary generation
   * @param {Object} data - Form data
   * @returns {string} - AI prompt string
   */
  static generateAIPrompt(data) {
    let promptString = `You are a helpful assistant specialized in summarizing cake orders for customers.

Based on the following information, generate a concise and friendly summary of the order.
Include all relevant details about the cake, such as type, amount, flavor, size, and decorations.
Also, include the pickup date, any allergies or special requests, and the total price.

Type: ${data.type}
Amount: ${data.amount}
`;

    if (data.type === 'cake') {
      promptString += `Cake Style: ${data.cakeStyle}\n`;
    }
    
    promptString += `Taste: ${data.taste}\n`;
    promptString += `Size: ${data.size}\n`;

    // Add cake-specific details to prompt
    if (data.type === 'cake') {
      promptString += this.generateCakeDetailsForAI(data);
    } else if (data.type === 'cupcake') {
      promptString += this.generateCupcakeDetailsForAI(data);
    }

    // Add common details
    promptString += this.generateCommonDetailsForAI(data);

    return promptString;
  }

  /**
   * Generate cake details for AI prompt
   * @param {Object} data - Form data
   * @returns {string} - Cake details for AI
   */
  static generateCakeDetailsForAI(data) {
    let prompt = `Layers: ${data.layers}\n`;
    
    if (data.naturalColors) prompt += `Natural Colors: Yes\n`;
    if (data.sprinkles) prompt += `Sprinkles: Yes\n`;
    if (data.piping) prompt += `Cream Decoration: Yes\n`;
    if (data.letters && data.letters !== 'no') {
      prompt += `Letters on Cake 1: ${data.letters}\n`;
      if (data.cakeName) prompt += `Name on Cake 1: "${data.cakeName}"\n`;
    }
    if (data.letters2 && data.letters2 !== 'no') {
      prompt += `Letters on Cake 2: ${data.letters2}\n`;
      if (data.cakeName2) prompt += `Name on Cake 2: "${data.cakeName2}"\n`;
    }
    if (data.nuts) prompt += `Nuts (decoration): Yes\n`;
    if (data.fruits) prompt += `Fruits (decoration): Yes\n`;
    if (data.coconutVanillaCream) prompt += `Coconut Vanilla Cream: Yes\n`;
    if (data.layerFillingValues.length > 0 && data.layers > 1) {
      prompt += `Layer Fillings: ${data.layerFillingValues.join(', ')}\n`;
    }
    if (data.topper1) {
      prompt += `Topper 1: Yes${data.topper1Text ? ` (${data.topper1Text})` : ''}\n`;
    }
    if (data.topper2) {
      prompt += `Topper 2: Yes${data.topper2Text ? ` (${data.topper2Text})` : ''}\n`;
    }

    return prompt;
  }

  /**
   * Generate cupcake details for AI prompt
   * @param {Object} data - Form data
   * @returns {string} - Cupcake details for AI
   */
  static generateCupcakeDetailsForAI(data) {
    let prompt = '';
    
    if (data.creamTopping) prompt += `Cream Topping: Yes\n`;
    if (data.naturalColors) prompt += `Natural Colors: Yes\n`;

    return prompt;
  }

  /**
   * Generate common details for AI prompt
   * @param {Object} data - Form data
   * @returns {string} - Common details for AI
   */
  static generateCommonDetailsForAI(data) {
    let prompt = '';

    if (data.theme) prompt += `Theme/Design: ${data.theme}\n`;
    if (data.pickupDate) {
      const dateParts = data.pickupDate.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      prompt += `Pickup Date: ${formattedDate}\n`;
    }
    if (data.alergies) prompt += `Allergies/Special Requests: ${data.alergies}\n`;
    
    prompt += `Total Price: €${data.totalPriceText}\n`;

    // Add custom additions
    if (data.customAddition && data.customAdditionText && data.customAdditionPrice > 0) {
      prompt += `Custom Addition 1: ${data.customAdditionText} (€${data.customAdditionPrice.toFixed(2)})\n`;
    }
    if (data.customAddition2 && data.customAddition2Text && data.customAddition2Price > 0) {
      prompt += `Custom Addition 2: ${data.customAddition2Text} (€${data.customAddition2Price.toFixed(2)})\n`;
    }

    // Add discount
    if (data.discount && data.discountAmount > 0) {
      prompt += `Discount Applied: -€${data.discountAmount.toFixed(2)}\n`;
    }

    return prompt;
  }

  /**
   * Call AI API to generate summary
   * @param {string} promptString - The prompt for AI
   * @returns {Promise<string>} - AI generated summary
   */
  static async callAISummaryAPI(promptString) {
    const response = await fetch(API_CONFIG.AI_SUMMARY_ENDPOINT, {
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

  /**
   * Format AI response with footer
   * @param {string} aiResponse - Raw AI response
   * @returns {string} - Formatted response with footer
   */
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