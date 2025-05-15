document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const cakeForm = document.getElementById('cakeForm');
    const totalPriceEl = document.getElementById('totalPrice');
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
    const layerFillingEl = document.getElementById('layerFilling');
    const topper1El = document.getElementById('topper1');
    const topper1TextEl = document.getElementById('topper1Text');
    const topper2El = document.getElementById('topper2');
    const topper2TextEl = document.getElementById('topper2Text');

    // New elements for custom addition and discount
    const customAdditionEl = document.getElementById('customAddition');
    const customAdditionTextEl = document.getElementById('customAdditionText');
    const customAdditionPriceEl = document.getElementById('customAdditionPrice');
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
            nuts: nutsEl.checked,
            fruits: fruitsEl.checked,
            layerFillingValues: [...layerFillingEl.options].filter(o => o.selected).map(o => o.value),
            layerFillingTexts: [...layerFillingEl.options].filter(o => o.selected).map(o => o.text),
            topper1: topper1El.checked,
            topper1Text: topper1TextEl.value.trim(),
            topper2: topper2El.checked,
            topper2Text: topper2TextEl.value.trim(),
            customAddition: customAdditionEl.checked,
            customAdditionText: customAdditionTextEl.value.trim(),
            customAdditionPrice: parseFloat(customAdditionPriceEl.value) || 0,
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

        if (data.type === 'cake') {
            price += data.size === '18' ? 30 : 35;
            price += (data.layers - 1) * 10;
            if (data.naturalColors) price += 2;
            if (data.sprinkles) price += 3;
            if (data.piping) price += data.cakeStyle === 'classic' ? 7 : 15;
            if (data.letters !== 'no') price += (data.letters === 'small' ? 0.2 : 0.5) * data.cakeName.length;
            if (data.nuts) price += 5;
            if (data.fruits) price += 5;
            if (data.layers > 1 && data.layerFillingValues.length > 0) {
                const totalFilling = data.layerFillingValues.reduce((sum, fill) => sum + (fill === 'jam' ? 1 : 1.5), 0);
                price += (data.layers - 1) * totalFilling;
            }
            if (data.topper1) price += 10;
            if (data.topper2) price += 10;
        } else { // Cupcake
            price += data.size === 'mini' ? 2 * data.amount : 4 * data.amount;
            if (data.creamTopping) price += 0.5 * data.amount;
            if (data.naturalColors) {
                if (data.amount <= 12) price += 1;
                else if (data.amount <= 30) price += 2;
                else price += 2 + Math.ceil((data.amount - 30) / 20) * 2;
            }
        }

        // Apply custom addition price
        if (data.customAddition && data.customAdditionPrice > 0) {
            price += data.customAdditionPrice;
        }

        // Apply discount
        if (data.discount && data.discountAmount > 0) {
            price -= data.discountAmount;
        }

        // Ensure price doesn't go below zero
        price = Math.max(0, price);

        totalPriceEl.textContent = price.toFixed(2);
    }

    function updateVisibility() {
        const currentType = typeEl.value;
        const prevType = typeEl.dataset.prevType || '';

        if (prevType && prevType !== currentType) {
            cakeForm.reset();
            themeEl.value = '';
            pickupDateEl.value = '';
            alergiesEl.value = '';
            topper1TextEl.value = '';
            topper2TextEl.value = '';
            customAdditionEl.checked = false; // Reset new fields
            customAdditionTextEl.value = '';
            customAdditionPriceEl.value = '';
            discountEl.checked = false;
            discountAmountEl.value = '';

            typeEl.value = currentType;
            amountEl.value = 1;
            if (orderSummaryOutputContainer) {
                orderSummaryOutputContainer.style.display = 'none';
            }
        }

        typeEl.dataset.prevType = currentType;

        const layersValue = parseInt(layersEl.value);
        const lettersValue = lettersEl.value;

        const cakeOnlyIds = ["cakeStyleLabel", "layersLabel", "sprinklesLabel", "pipingLabel", "lettersLabel", "nameLabel", "nutsLabel", "fruitsLabel", "toppers1Label", "toppers2Label"];
        const cupcakeOnlyIds = ["creamToppingLabel"];

        cakeOnlyIds.forEach(id => document.getElementById(id).classList.toggle('hidden', currentType !== 'cake'));
        cupcakeOnlyIds.forEach(id => document.getElementById(id).classList.toggle('hidden', currentType !== 'cupcake'));

        document.getElementById('layerFillingLabel').classList.toggle('hidden', currentType !== 'cake' || layersValue === 1);

        const nameLabel = document.getElementById('nameLabel');
        const hideName = currentType !== 'cake' || lettersValue === 'no';
        nameLabel.classList.toggle('hidden', hideName);
        if (hideName) cakeNameEl.value = '';

        Array.from(tasteEl.options).forEach(opt => {
            opt.disabled = (currentType === 'cake' && (opt.value === 'carrot' || opt.value === 'orange'));
        });

        const validSizes = currentType === 'cake' ? ['18', '20'] : ['mini', 'regular'];
        Array.from(sizeEl.options).forEach(opt => {
            const isValid = validSizes.includes(opt.value);
            opt.hidden = !isValid;
            opt.disabled = !isValid;
        });

        if (!validSizes.includes(sizeEl.value)) {
            sizeEl.value = validSizes[0];
        }

        const isCakeType = currentType === 'cake';
        topper1TextEl.classList.toggle('hidden', !topper1El.checked || !isCakeType);
        topper2TextEl.classList.toggle('hidden', !topper2El.checked || !isCakeType);

        if (!topper1El.checked || !isCakeType) {
            topper1TextEl.value = '';
        }
        if (!topper2El.checked || !isCakeType) {
            topper2TextEl.value = '';
        }

        // Visibility for custom addition
        customAdditionTextEl.classList.toggle('hidden', !customAdditionEl.checked);
        customAdditionPriceEl.classList.toggle('hidden', !customAdditionEl.checked);
        if (!customAdditionEl.checked) {
            customAdditionTextEl.value = '';
            customAdditionPriceEl.value = '';
        }

        // Visibility for discount
        discountAmountEl.classList.toggle('hidden', !discountEl.checked);
        if (!discountEl.checked) {
            discountAmountEl.value = '';
        }
    }

    function generateStandardSummaryText(data) {
        let summary = `Thanks so much for your interest in our custom ${data.type === 'cake' ? '🎂 cake' : '🧁 cupcake'}! Based on your preferences, here's your order summary:\n\n`;
        summary += `📝 *Order Summary:*

`;
        summary += `✨ *Type:* ${data.typeText}
`;
        summary += `🔢 *Amount:* ${data.amount}
`;
        if (data.type === 'cake') {
            summary += `🎀 *Style:* ${data.cakeStyleText}
`;
        }
        summary += `🍰 *Flavor:* ${data.tasteText}
`;

        if (data.type === 'cake') {
            summary += `📏 *Size:* ${data.sizeText}
`;
        } else {
            summary += `🧁 *Cupcake Size:* ${data.sizeText}
`;
        }

        if (data.theme) {
            summary += `🎨 *Theme/Design:* ${data.theme}
`;
        }

        if (data.type === 'cake') {
            if (data.layers > 1) {
                summary += `겹 *Layers:* ${data.layers}
`;
            }
            if (data.naturalColors) {
                summary += `🌿 *Natural Colors:* Yes
`;
            }
            if (data.sprinkles) {
                summary += `✨ *Sprinkles:* Yes
`;
            }
            if (data.piping) {
                summary += `🍥 *Cream Decoration:* Yes
`;
            }
            if (data.letters !== 'no') {
                summary += `🔤 *Letters on Cake:* ${data.lettersText}
`;
                if (data.cakeName) {
                    summary += `🏷️ *Name on Cake:* "${data.cakeName}"
`;
                }
            }
            if (data.nuts) {
                summary += `🥜 *Nuts (decoration):* Yes
`;
            }
            if (data.fruits) {
                summary += `🍓 *Fruits (decoration):* Yes
`;
            }
            if (data.layerFillingTexts.length > 0 && data.layers > 1) {
                summary += `🍰겹 *Layer Fillings:* ${data.layerFillingTexts.join(', ')}
`;
            }
            if (data.topper1) {
                summary += `🎉 *Topper 1:* Yes`;
                if (data.topper1Text) {
                    summary += ` (${data.topper1Text})`;
                }
                summary += `
`;
            }
            if (data.topper2) {
                summary += `🎊 *Topper 2:* Yes`;
                if (data.topper2Text) {
                    summary += ` (${data.topper2Text})`;
                }
                summary += `
`;
            }
        } else if (data.type === 'cupcake') {
            if (data.creamTopping) {
                summary += `🍦 *Cream Topping:* Yes
`;
            }
            if (data.naturalColors) {
                summary += `🌿 *Natural Colors:* Yes
`;
            }
        }

        // Custom Addition
        if (data.customAddition && data.customAdditionText && data.customAdditionPrice > 0) {
            summary += `➕ *Custom Addition:* ${data.customAdditionText} (€${data.customAdditionPrice.toFixed(2)})
`;
        }

        // Discount
        if (data.discount && data.discountAmount > 0) {
            summary += `➖ *Discount Applied:* -€${data.discountAmount.toFixed(2)}
`;
        }

        if (data.pickupDate) {
            const dateParts = data.pickupDate.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            summary += `🗓️ *Pickup Date:* ${formattedDate}
`;
        } else {
            summary += `🗓️ *Pickup Date:* _Not specified_
`;
        }

        if (data.alergies) {
            summary += `⚠️ *Allergies/Special Requests:* ${data.alergies}
`;
        }

        summary += `
💰 *Total Price:* €${data.totalPriceText}

`;
        summary += `To confirm your order, please complete the payment via this Tikkie link:
`;
        summary += `👉 <span class="tikkie-placeholder">[Tikkie link]</span>

`;
        summary += `Once the payment is done, your order will be officially confirmed. If you have any questions, I'm here for you! 💬

`;
        summary += `Looking forward to baking something special for you! 🎂🧁

`;
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

        // Construct the prompt for AI
        let promptString = `You are a helpful assistant specialized in summarizing cake orders for customers.

Based on the following information, generate a concise and friendly summary of the order.
Include all relevant details about the cake, such as type, amount, flavor, size, and decorations.
Also, include the pickup date, any allergies or special requests, and the total price.

Type: ${data.type}
Amount: ${data.amount}
`;
        if (data.type === 'cake') {
            promptString += `Cake Style: ${data.cakeStyle}
`;
        }
        promptString += `Taste: ${data.taste}
`;
        promptString += `Size: ${data.size}
`;

        if (data.type === 'cupcake' && data.creamTopping) {
            promptString += `Cream Topping: Yes
`;
        }
        if (data.type === 'cake') {
            promptString += `Layers: ${data.layers}
`;
        }
        if (data.naturalColors) {
            promptString += `Natural Colors: Yes
`;
        }
        if (data.type === 'cake' && data.sprinkles) {
            promptString += `Sprinkles: Yes
`;
        }
        if (data.type === 'cake' && data.piping) {
            promptString += `Cream Decoration: Yes
`;
        }
        if (data.type === 'cake' && data.letters && data.letters !== 'no') {
            promptString += `Letters: ${data.letters}
`;
            if (data.cakeName) {
                promptString += `Cake Name: "${data.cakeName}"
`;
            }
        }
        if (data.type === 'cake' && data.nuts) {
            promptString += `Nuts (decoration): Yes
`;
        }
        if (data.type === 'cake' && data.fruits) {
            promptString += `Fruits (decoration): Yes
`;
        }
        if (data.type === 'cake' && data.layerFillingValues.length > 0 && data.layers > 1) {
            promptString += `Layer Fillings: ${data.layerFillingValues.join(', ')}
`;
        }
        if (data.type === 'cake' && data.topper1) {
            promptString += `Topper 1: Yes`;
            if (data.topper1Text) promptString += ` (${data.topper1Text})`;
            promptString += `
`;
        }
        if (data.type === 'cake' && data.topper2) {
            promptString += `Topper 2: Yes`;
            if (data.topper2Text) promptString += ` (${data.topper2Text})`;
            promptString += `
`;
        }
        if (data.theme) {
            promptString += `Theme/Design: ${data.theme}
`;
        }
        if (data.pickupDate) {
            const dateParts = data.pickupDate.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            promptString += `Pickup Date: ${formattedDate}
`;
        }
        if (data.alergies) {
            promptString += `Allergies/Special Requests: ${data.alergies}
`;
        }
        promptString += `Total Price: €${data.totalPriceText}
`;

        // Add custom addition to prompt
        if (data.customAddition && data.customAdditionText && data.customAdditionPrice > 0) {
            promptString += `Custom Addition: ${data.customAdditionText} (€${data.customAdditionPrice.toFixed(2)})
`;
        }

        // Add discount to prompt
        if (data.discount && data.discountAmount > 0) {
            promptString += `Discount Applied: -€${data.discountAmount.toFixed(2)})
`;
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
        if (data.cakeName) eventDetails += `Name on Cake: ${data.cakeName}\n`;
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
        if (data.cakeName) taskDetails += `Name on Cake: ${data.cakeName}\n`;
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