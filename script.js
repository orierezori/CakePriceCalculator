document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const cakeForm = document.getElementById('cakeForm');
    const totalPriceEl = document.getElementById('totalPriceOutput');
    const typeEl = document.getElementById('type');
    const amountEl = document.getElementById('amount');
    const cakeStyleEl = document.getElementById('cakeStyle');
    const tasteEl = document.getElementById('taste');
    const sizeEl = document.getElementById('size');
    const creamToppingEl = document.getElementById('creamTopping');
    const layersEl = document.getElementById('layers');
    const naturalColorsEl = document.getElementById('naturalColors');
    const sprinklesEl = document.getElementById('sprinkles');
    const pipingEl = document.getElementById('piping');
    const lettersEl = document.getElementById('letters');
    const cakeNameEl = document.getElementById('cakeName');
    const nutsEl = document.getElementById('nuts');
    const fruitsEl = document.getElementById('fruits');
    const coconutVanillaCreamEl = document.getElementById('coconutVanillaCream');
    const layerFillingEl = document.getElementById('layerFilling');
    const letters2El = document.getElementById('letters2');
    const cakeName2El = document.getElementById('cakeName2');
    const topper1El = document.getElementById('topper1');
    const topper1TextEl = document.getElementById('topper1Text');
    const topper2El = document.getElementById('topper2');
    const topper2TextEl = document.getElementById('topper2Text');

    // New elements for custom addition and discount
    const customAdditionEl = document.getElementById('customAddition');
    const customAdditionTextEl = document.getElementById('customAdditionText');
    const customAdditionPriceEl = document.getElementById('customAdditionPrice');
    const customAddition2El = document.getElementById('customAddition2');
    const customAddition2TextEl = document.getElementById('customAddition2Text');
    const customAddition2PriceEl = document.getElementById('customAddition2Price');
    const discountEl = document.getElementById('discount');
    const discountAmountEl = document.getElementById('discountAmount');

    const themeEl = document.getElementById('theme');
    const pickupDateEl = document.getElementById('pickupDate');
    const alergiesEl = document.getElementById('alergies');

    const summariseOrderBtn = document.getElementById('summariseOrderBtn');
    const summariseOrderAIBtn = document.getElementById('summariseOrderAIBtn');
    const orderSummaryOutputContainer = document.getElementById('orderSummaryOutputContainer');
    const orderSummaryOutput = document.getElementById('orderSummaryOutput');
    const copySummaryBtn = document.getElementById('copySummaryBtn');
    const generateTikkieBtn = document.getElementById('generateTikkieBtn');
    const addToCalendarBtn = document.getElementById('addToCalendarBtn');
    const addTaskBtn = document.getElementById('addTaskBtn');

    // Helper to get selected options text for a select element
    function getSelectedOptionText(selectElement) {
        return selectElement.options[selectElement.selectedIndex].text;
    }

    // Function to gather all form data
    function getFormData() {
        return {
            type: typeEl.value,
            typeText: getSelectedOptionText(typeEl),
            amount: parseInt(amountEl.value),
            cakeStyle: cakeStyleEl.value,
            cakeStyleText: getSelectedOptionText(cakeStyleEl),
            taste: tasteEl.value,
            tasteText: getSelectedOptionText(tasteEl),
            size: sizeEl.value,
            sizeText: getSelectedOptionText(sizeEl),
            creamTopping: creamToppingEl.checked,
            layers: parseInt(layersEl.value),
            naturalColors: naturalColorsEl.checked,
            sprinkles: sprinklesEl.checked,
            piping: pipingEl.checked,
            letters: lettersEl.value,
            lettersText: getSelectedOptionText(lettersEl),
            cakeName: cakeNameEl.value.trim(),
            letters2: letters2El.value,
            letters2Text: getSelectedOptionText(letters2El),
            cakeName2: cakeName2El.value.trim(),
            nuts: nutsEl.checked,
            fruits: fruitsEl.checked,
            coconutVanillaCream: coconutVanillaCreamEl.checked,
            layerFillingValues: [...layerFillingEl.options].filter(o => o.selected).map(o => o.value),
            layerFillingTexts: [...layerFillingEl.options].filter(o => o.selected).map(o => o.text),
            topper1: topper1El.checked,
            topper1Text: topper1TextEl.value.trim(),
            topper2: topper2El.checked,
            topper2Text: topper2TextEl.value.trim(),
            customAddition: customAdditionEl.checked,
            customAdditionText: customAdditionTextEl.value.trim(),
            customAdditionPrice: parseFloat(customAdditionPriceEl.value) || 0,
            customAddition2: customAddition2El.checked,
            customAddition2Text: customAddition2TextEl.value.trim(),
            customAddition2Price: parseFloat(customAddition2PriceEl.value) || 0,
            discount: discountEl.checked,
            discountAmount: parseFloat(discountAmountEl.value) || 0,
            theme: themeEl.value.trim(),
            pickupDate: pickupDateEl.value,
            alergies: alergiesEl.value.trim(),
            totalPriceText: totalPriceEl.textContent
        };
    }

    function calculatePrice() {
        const data = getFormData();
        let price = 0;

        // Pricing constants
        const CAKE_BASE_PRICE_16 = 30;
        const CAKE_BASE_PRICE_18 = 30;
        const CAKE_BASE_PRICE_20 = 35;
        const CAKE_BASE_PRICE_22 = 40;
        const CAKE_BASE_PRICE_24 = 45;
        const CAKE_LAYER_INCREMENT = 10;
        const CAKE_NATURAL_COLORS_PRICE = 2;
        const CAKE_SPRINKLES_PRICE = 3;
        const CAKE_PIPING_CLASSIC_PRICE = 7;
        const CAKE_PIPING_CUSTOM_PRICE = 15;
        const CAKE_LETTERS_SMALL_PRICE_PER_CHAR = 0.2;
        const CAKE_LETTERS_BIG_PRICE_PER_CHAR = 0.5;
        const CAKE_NUTS_PRICE = 5;
        const CAKE_FRUITS_PRICE = 5;
        const CAKE_COCONUT_VANILLA_CREAM_PRICE = 7;
        const CAKE_FILLING_NUTS_FRUITS_OREO_LOTUS_PRICE = 1.5;
        const CAKE_FILLING_LEMON_ORANGE_RASPBERRY_STRAWBERRY_PRICE = 2;
        const CAKE_FILLING_FRESH_STRAWBERRY_PRICE = 3;
        const CAKE_TOPPER_PRICE = 10;

        const CUPCAKE_MINI_PRICE = 2;
        const CUPCAKE_REGULAR_PRICE = 4;
        const CUPCAKE_CREAM_TOPPING_PRICE_PER_UNIT = 0.5;
        const CUPCAKE_NATURAL_COLORS_TIER1_PRICE = 1; // up to 12
        const CUPCAKE_NATURAL_COLORS_TIER2_PRICE = 2; // up to 30
        const CUPCAKE_NATURAL_COLORS_ADDITIONAL_PRICE_PER_20 = 2; // for > 30

        if (data.type === 'cake') {
            // Base price by size
            switch(data.size) {
                case '16': price += CAKE_BASE_PRICE_16; break;
                case '18': price += CAKE_BASE_PRICE_18; break;
                case '20': price += CAKE_BASE_PRICE_20; break;
                case '22': price += CAKE_BASE_PRICE_22; break;
                case '24': price += CAKE_BASE_PRICE_24; break;
            }
            price += (data.layers - 1) * CAKE_LAYER_INCREMENT;
            if (data.naturalColors) price += CAKE_NATURAL_COLORS_PRICE;
            if (data.sprinkles) price += CAKE_SPRINKLES_PRICE;
            if (data.piping) price += data.cakeStyle === 'classic' ? CAKE_PIPING_CLASSIC_PRICE : CAKE_PIPING_CUSTOM_PRICE;
            if (data.letters !== 'no') price += (data.letters === 'small' ? CAKE_LETTERS_SMALL_PRICE_PER_CHAR : CAKE_LETTERS_BIG_PRICE_PER_CHAR) * data.cakeName.length;
            if (data.letters2 !== 'no') price += (data.letters2 === 'small' ? CAKE_LETTERS_SMALL_PRICE_PER_CHAR : CAKE_LETTERS_BIG_PRICE_PER_CHAR) * data.cakeName2.length;
            if (data.nuts) price += CAKE_NUTS_PRICE;
            if (data.fruits) price += CAKE_FRUITS_PRICE;
            if (data.coconutVanillaCream) price += CAKE_COCONUT_VANILLA_CREAM_PRICE;
            if (data.layers > 1 && data.layerFillingValues.length > 0) {
                const totalFilling = data.layerFillingValues.reduce((sum, fill) => {
                    if (['lemon', 'orangemango', 'raspberry', 'strawberry'].includes(fill)) {
                        return sum + CAKE_FILLING_LEMON_ORANGE_RASPBERRY_STRAWBERRY_PRICE;
                    } else if (fill === 'freshstrawberry') {
                        return sum + CAKE_FILLING_FRESH_STRAWBERRY_PRICE;
                    } else {
                        return sum + CAKE_FILLING_NUTS_FRUITS_OREO_LOTUS_PRICE;
                    }
                }, 0);
                price += (data.layers - 1) * totalFilling;
            }
            if (data.topper1) price += CAKE_TOPPER_PRICE;
            if (data.topper2) price += CAKE_TOPPER_PRICE; // Assuming topper2 has the same price
        } else { // Cupcake
            price += data.size === 'mini' ? CUPCAKE_MINI_PRICE * data.amount : CUPCAKE_REGULAR_PRICE * data.amount;
            if (data.creamTopping) price += CUPCAKE_CREAM_TOPPING_PRICE_PER_UNIT * data.amount;
            if (data.naturalColors) {
                if (data.amount <= 12) price += CUPCAKE_NATURAL_COLORS_TIER1_PRICE;
                else if (data.amount <= 30) price += CUPCAKE_NATURAL_COLORS_TIER2_PRICE;
                else price += CUPCAKE_NATURAL_COLORS_TIER2_PRICE + Math.ceil((data.amount - 30) / 20) * CUPCAKE_NATURAL_COLORS_ADDITIONAL_PRICE_PER_20;
            }
        }

        // Apply custom addition price
        if (data.customAddition && data.customAdditionPrice > 0) {
            price += data.customAdditionPrice;
        }
        if (data.customAddition2 && data.customAddition2Price > 0) {
            price += data.customAddition2Price;
        }

        // Apply discount
        if (data.discount && data.discountAmount > 0) {
            price -= data.discountAmount;
        }

        // Ensure price doesn't go below zero
        price = Math.max(0, price);

        totalPriceEl.textContent = price.toFixed(2);
    }

    // --- Visibility Logic Refactor ---

    function resetFormFieldsOnTypeChange(currentType, prevType) {
        if (prevType && prevType !== currentType) {
            // Preserve values before reset
            const themeValue = themeEl.value;
            const pickupDateValue = pickupDateEl.value;
            const alergiesValue = alergiesEl.value;

            cakeForm.reset(); // Resets all form fields to their defaults

            // Restore non-form specific fields if needed, or clear them explicitly
            themeEl.value = themeValue; // Or clear: themeEl.value = '';
            pickupDateEl.value = pickupDateValue; // Or clear: pickupDateEl.value = '';
            alergiesEl.value = alergiesValue; // Or clear: alergiesEl.value = '';
            
            // Explicitly reset fields that might not be part of cakeForm.elements or need special handling
            topper1TextEl.value = '';
            topper2TextEl.value = '';
            customAdditionEl.checked = false;
            customAdditionTextEl.value = '';
            customAdditionPriceEl.value = '';
            customAddition2El.checked = false;
            customAddition2TextEl.value = '';
            customAddition2PriceEl.value = '';
            coconutVanillaCreamEl.checked = false;
            letters2El.value = 'no';
            cakeName2El.value = '';
            discountEl.checked = false;
            discountAmountEl.value = '';
            
            typeEl.value = currentType; // Set the type back to the selected one
            amountEl.value = 1; // Default amount

            if (orderSummaryOutputContainer) {
                orderSummaryOutputContainer.style.display = 'none';
            }
            return true; // Indicates a reset happened
        }
        return false; // No reset happened
    }

    function updateTypeSpecificVisibility(currentType) {
        const cakeOnlyIds = ["cakeStyleLabel", "layersLabel", "sprinklesLabel", "pipingLabel", "lettersLabel", "nameLabel", "letters2Label", "name2Label", "nutsLabel", "fruitsLabel", "coconutVanillaCreamLabel", "toppers1Label", "toppers2Label"];
        const cupcakeOnlyIds = ["creamToppingLabel"];

        cakeOnlyIds.forEach(id => document.getElementById(id).classList.toggle('hidden', currentType !== 'cake'));
        cupcakeOnlyIds.forEach(id => document.getElementById(id).classList.toggle('hidden', currentType !== 'cupcake'));
    }

    function updateTasteAndSizeOptions(currentType) {
        // All tastes are now available for cakes
        Array.from(tasteEl.options).forEach(opt => {
            opt.disabled = false;
        });

        const validSizes = currentType === 'cake' ? ['16', '18', '20', '22', '24'] : ['mini', 'regular'];
        Array.from(sizeEl.options).forEach(opt => {
            const isValid = validSizes.includes(opt.value);
            opt.hidden = !isValid;
            opt.disabled = !isValid; // Also disable to prevent submission if somehow visible
        });

        if (!validSizes.includes(sizeEl.value)) {
            sizeEl.value = validSizes[0]; // Default to first valid size
        }
    }

    function updateConditionalFieldVisibility(currentType) {
        const layersValue = parseInt(layersEl.value);
        const lettersValue = lettersEl.value;
        const isCakeType = currentType === 'cake';

        // Layer Filling visibility
        document.getElementById('layerFillingLabel').classList.toggle('hidden', !isCakeType || layersValue <= 1);

        // Name Label visibility
        const nameLabel = document.getElementById('nameLabel');
        const hideName = !isCakeType || lettersValue === 'no';
        nameLabel.classList.toggle('hidden', hideName);
        if (hideName) cakeNameEl.value = '';
        
        // Name 2 Label visibility
        const letters2Value = letters2El.value;
        const name2Label = document.getElementById('name2Label');
        const hideName2 = !isCakeType || letters2Value === 'no';
        name2Label.classList.toggle('hidden', hideName2);
        if (hideName2) cakeName2El.value = '';

        // Topper text fields
        topper1TextEl.classList.toggle('hidden', !topper1El.checked || !isCakeType);
        topper2TextEl.classList.toggle('hidden', !topper2El.checked || !isCakeType);
        if (!topper1El.checked || !isCakeType) topper1TextEl.value = '';
        if (!topper2El.checked || !isCakeType) topper2TextEl.value = '';
        
        // Custom Addition text and price fields
        customAdditionTextEl.classList.toggle('hidden', !customAdditionEl.checked);
        customAdditionPriceEl.classList.toggle('hidden', !customAdditionEl.checked);
        if (!customAdditionEl.checked) {
            customAdditionTextEl.value = '';
            customAdditionPriceEl.value = '';
        }
        
        // Custom Addition 2 text and price fields
        customAddition2TextEl.classList.toggle('hidden', !customAddition2El.checked);
        customAddition2PriceEl.classList.toggle('hidden', !customAddition2El.checked);
        if (!customAddition2El.checked) {
            customAddition2TextEl.value = '';
            customAddition2PriceEl.value = '';
        }

        // Discount amount field
        discountAmountEl.classList.toggle('hidden', !discountEl.checked);
        if (!discountEl.checked) {
            discountAmountEl.value = '';
        }
    }

    function updateVisibility() {
        const currentType = typeEl.value;
        const prevType = typeEl.dataset.prevType || '';

        if (resetFormFieldsOnTypeChange(currentType, prevType)) {
            // If form was reset, prevType needs to be updated for the current run
            typeEl.dataset.prevType = currentType;
            // Recalculate price and update visibility again to ensure correct state after reset
            updateTypeSpecificVisibility(currentType);
            updateTasteAndSizeOptions(currentType);
            updateConditionalFieldVisibility(currentType);
            calculatePrice(); 
            return; // Exit early as everything is set post-reset
        }
        typeEl.dataset.prevType = currentType;

        updateTypeSpecificVisibility(currentType);
        updateTasteAndSizeOptions(currentType);
        updateConditionalFieldVisibility(currentType);
    }
    // --- End of Visibility Logic Refactor ---

    function generateStandardSummaryText(data) {
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

        if (data.type === 'cake') {
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
        } else if (data.type === 'cupcake') {
            if (data.creamTopping) {
                summary += `🍦 *Cream Topping:* Yes\n`;
            }
            if (data.naturalColors) {
                summary += `🌿 *Natural Colors:* Yes\n`;
            }
        }

        // Custom Addition
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

        summary += `\n💰 *Total Price:* €${data.totalPriceText}\n\n`;
        summary += `To confirm your order, please complete the payment via this Tikkie link:\n`;
        summary += `👉 <span class="tikkie-placeholder">[Tikkie link]</span>\n\n`;
        summary += `Once the payment is done, your order will be officially confirmed. If you have any questions, I'm here for you! 💬\n\n`;
        summary += `Looking forward to baking something special for you! 🎂🧁\n\n`;
        summary += `Maayan (Manu) 🩷`;
        return summary;
    }

    summariseOrderBtn.addEventListener('click', () => {
        calculatePrice(); // Ensure price is up-to-date before generating summary
        const formData = getFormData(); // Get fresh data including updated price
        const summaryText = generateStandardSummaryText(formData);
        orderSummaryOutput.innerHTML = summaryText;
        orderSummaryOutputContainer.style.display = 'block';
    });

    summariseOrderAIBtn.addEventListener('click', async () => {
        calculatePrice(); // Ensure price is current
        const data = getFormData(); // Get fresh data including updated price

        // Construct the prompt for AI using template literals
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

        if (data.type === 'cupcake' && data.creamTopping) {
            promptString += `Cream Topping: Yes\n`;
        }
        if (data.type === 'cake') {
            promptString += `Layers: ${data.layers}\n`;
        }
        if (data.naturalColors) {
            promptString += `Natural Colors: Yes\n`;
        }
        if (data.type === 'cake' && data.sprinkles) {
            promptString += `Sprinkles: Yes\n`;
        }
        if (data.type === 'cake' && data.piping) {
            promptString += `Cream Decoration: Yes\n`;
        }
        if (data.type === 'cake' && data.letters && data.letters !== 'no') {
            promptString += `Letters on Cake 1: ${data.letters}\n`;
            if (data.cakeName) {
                promptString += `Name on Cake 1: "${data.cakeName}"\n`;
            }
        }
        if (data.type === 'cake' && data.letters2 && data.letters2 !== 'no') {
            promptString += `Letters on Cake 2: ${data.letters2}\n`;
            if (data.cakeName2) {
                promptString += `Name on Cake 2: "${data.cakeName2}"\n`;
            }
        }
        if (data.type === 'cake' && data.nuts) {
            promptString += `Nuts (decoration): Yes\n`;
        }
        if (data.type === 'cake' && data.fruits) {
            promptString += `Fruits (decoration): Yes\n`;
        }
        if (data.type === 'cake' && data.coconutVanillaCream) {
            promptString += `Coconut Vanilla Cream: Yes\n`;
        }
        if (data.type === 'cake' && data.layerFillingValues.length > 0 && data.layers > 1) {
            promptString += `Layer Fillings: ${data.layerFillingValues.join(', ')}\n`;
        }
        if (data.type === 'cake' && data.topper1) {
            promptString += `Topper 1: Yes${data.topper1Text ? ` (${data.topper1Text})` : ''}\n`;
        }
        if (data.type === 'cake' && data.topper2) {
            promptString += `Topper 2: Yes${data.topper2Text ? ` (${data.topper2Text})` : ''}\n`;
        }
        if (data.theme) {
            promptString += `Theme/Design: ${data.theme}\n`;
        }
        if (data.pickupDate) {
            const dateParts = data.pickupDate.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            promptString += `Pickup Date: ${formattedDate}\n`;
        }
        if (data.alergies) {
            promptString += `Allergies/Special Requests: ${data.alergies}\n`;
        }
        promptString += `Total Price: €${data.totalPriceText}\n`;

        // Add custom addition to prompt
        if (data.customAddition && data.customAdditionText && data.customAdditionPrice > 0) {
            promptString += `Custom Addition 1: ${data.customAdditionText} (€${data.customAdditionPrice.toFixed(2)})\n`;
        }
        if (data.customAddition2 && data.customAddition2Text && data.customAddition2Price > 0) {
            promptString += `Custom Addition 2: ${data.customAddition2Text} (€${data.customAddition2Price.toFixed(2)})\n`;
        }

        // Add discount to prompt
        if (data.discount && data.discountAmount > 0) {
            promptString += `Discount Applied: -€${data.discountAmount.toFixed(2)})\n`; // Corrected trailing parenthesis
        }

        // UI updates for loading state
        summariseOrderAIBtn.disabled = true;
        summariseOrderAIBtn.textContent = 'Generating...';
        orderSummaryOutput.innerHTML = 'Generating AI summary, please wait...'; // Use innerHTML for consistency
        orderSummaryOutputContainer.style.display = 'block';

        try {
            const response = await fetch('https://gemini-api-worker.orierezori.workers.dev/', {
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
            if (result && result.response) {
                let aiSummary = result.response;
                aiSummary += `

To confirm your order, please complete the payment via the Tikkie link below.
`;
                aiSummary += `Once the payment is done, your order will be officially confirmed. If you have any questions, I'm here for you! 💬

`;
                aiSummary += `Looking forward to baking something special for you! 🎂🧁

`;
                aiSummary += `Maayan (Manu) 🩷
`;
                aiSummary += `Payment Link:

`;
                aiSummary += `<span class="tikkie-placeholder">[Tikkie link]</span>`;
                orderSummaryOutput.innerHTML = aiSummary;
            } else {
                orderSummaryOutput.textContent = 'Failed to get a valid summary from AI. Response structure might be incorrect.';
            }
        } catch (error) {
            console.error('Error calling AI summary API:', error);
            orderSummaryOutput.innerHTML = `Error generating AI summary: ${error.message}. <br><br>Make sure the API endpoint is correct and the server is running.`; // Use innerHTML for error message too.
        } finally {
            summariseOrderAIBtn.disabled = false;
            summariseOrderAIBtn.textContent = 'Summarise Order AI';
        }
    });


    copySummaryBtn.addEventListener('click', () => {
        const summaryText = orderSummaryOutput.textContent;
        if (navigator.clipboard && summaryText) {
            navigator.clipboard.writeText(summaryText)
                .then(() => {
                    const originalText = copySummaryBtn.innerHTML;
                    copySummaryBtn.innerHTML = 'Copied!';
                    setTimeout(() => {
                        copySummaryBtn.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy text. Please try manually.');
                });
        } else {
            alert('Clipboard API not available or no summary to copy.');
        }
    });

    generateTikkieBtn.addEventListener('click', () => {
        window.open('https://play.google.com/store/apps/details?id=com.abnamro.nl.tikkie&hl=en', '_blank');
    });

    addToCalendarBtn.addEventListener('click', () => {
        const data = getFormData();
        if (!data.pickupDate) {
            alert("Please select a pickup date first.");
            return;
        }

        const eventTitle = `${data.typeText} Pickup${data.theme ? " " + data.theme : ""}`;
        const baseDate = data.pickupDate.replace(/-/g, ''); // YYYYMMDD
        const startTime = '120000'; // 12:00:00 PM
        const endTime = '130000';   // 1:00:00 PM (1 hour duration)
        const calendarStartDate = baseDate + 'T' + startTime;
        const calendarEndDate = baseDate + 'T' + endTime;

        let eventDetails = `Order Summary:\nType: ${data.typeText}\nAmount: ${data.amount}\nFlavor: ${data.tasteText}\n`;
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
    });

    addTaskBtn.addEventListener('click', () => {
        const data = getFormData();

        const taskTitle = `Cake Order: ${data.theme || (data.typeText + (data.type === 'cake' ? ' Cake' : ' Cupcakes'))}`;
        
        let taskDetails = `Type: ${data.typeText}\nAmount: ${data.amount}\nFlavor: ${data.tasteText}\n`;
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
                    window.open('https://tasks.google.com/embed/frame?', '_blank');
                })
                .catch(err => {
                    console.error('Failed to copy task details: ', err);
                    alert('Failed to copy task details. Please try manually. Opening Google Tasks.');
                    window.open('https://tasks.google.com/embed/frame?', '_blank');
                });
        } else {
            alert('Clipboard API not available. Opening Google Tasks. Please manually copy details.');
            window.open('https://tasks.google.com/embed/frame?', '_blank');
            // Fallback for manual copy if needed - perhaps show details in a prompt
            prompt("Copy these details for your task:", textToCopy);
        }
    });

    orderSummaryOutput.addEventListener('click', function (event) {
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

    // Initial setup
    cakeForm.addEventListener('change', () => {
        updateVisibility();
        calculatePrice();
    });

    updateVisibility();
    calculatePrice();
}); 