/* ===== MAIN APPLICATION INITIALIZATION ===== */

import { FormHandler } from './form-handler.js';
import { UIController } from './ui-controller.js';
import { PriceCalculator } from './calculator.js';
import { SummaryGenerator } from './summary.js';
import { API_CONFIG } from './config.js';

class CakePriceCalculatorApp {
  constructor() {
    this.formHandler = new FormHandler();
    this.uiController = new UIController(this.formHandler);
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;
    
    this.setupEventListeners();
    this.updateVisibilityAndPrice();
    this.isInitialized = true;
  }

  /**
   * Set up all event listeners
   */
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

  /**
   * Update visibility and calculate price
   */
  updateVisibilityAndPrice() {
    this.uiController.updateVisibility();
    this.calculateAndUpdatePrice();
  }

  /**
   * Calculate price and update display
   */
  calculateAndUpdatePrice() {
    const formData = this.formHandler.getFormData();
    const price = PriceCalculator.calculateTotalPrice(formData);
    this.formHandler.updateTotalPrice(price);
  }

  /**
   * Set up summary generation buttons
   */
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

  /**
   * Generate standard order summary
   */
  generateStandardSummary() {
    this.calculateAndUpdatePrice(); // Ensure price is current
    const formData = this.formHandler.getFormData();
    const summaryText = SummaryGenerator.generateStandardSummary(formData);
    
    if (this.formHandler.elements.ORDER_SUMMARY_OUTPUT) {
      this.formHandler.elements.ORDER_SUMMARY_OUTPUT.innerHTML = summaryText;
    }
    if (this.formHandler.elements.ORDER_SUMMARY_CONTAINER) {
      this.formHandler.elements.ORDER_SUMMARY_CONTAINER.style.display = 'block';
    }
  }

  /**
   * Generate AI-powered order summary
   */
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

  /**
   * Set up action buttons (copy, tikkie, calendar, task)
   */
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
        window.open(API_CONFIG.TIKKIE_PLAY_STORE_URL, '_blank');
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

  /**
   * Copy summary to clipboard
   */
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

  /**
   * Add order to Google Calendar
   */
  addToCalendar() {
    const data = this.formHandler.getFormData();
    
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
  }

  /**
   * Add task to Google Tasks
   */
  addTask() {
    const data = this.formHandler.getFormData();

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
          window.open(API_CONFIG.GOOGLE_TASKS_URL, '_blank');
        })
        .catch(err => {
          console.error('Failed to copy task details: ', err);
          alert('Failed to copy task details. Please try manually. Opening Google Tasks.');
          window.open(API_CONFIG.GOOGLE_TASKS_URL, '_blank');
        });
    } else {
      alert('Clipboard API not available. Opening Google Tasks. Please manually copy details.');
      window.open(API_CONFIG.GOOGLE_TASKS_URL, '_blank');
      prompt("Copy these details for your task:", textToCopy);
    }
  }

  /**
   * Set up Tikkie placeholder click handler
   */
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new CakePriceCalculatorApp();
  app.init();
});