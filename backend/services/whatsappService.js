import axios from 'axios';
import config from '../config/config.js';

class WhatsAppService {
  constructor() {
    this.apiUrl = config.whatsapp.apiUrl;
    this.phoneNumberId = config.whatsapp.phoneNumberId;
    this.apiToken = config.whatsapp.apiToken;
    this.messageLogs = [];
  }

  /**
   * Send WhatsApp message using Cloud API
   * @param {string} phoneNumber - Recipient phone number (with country code, no +)
   * @param {string} message - Message text to send
   * @param {Object} templateData - Template data if using template
   * @returns {Object} Response from WhatsApp API
   */
  async sendMessage(phoneNumber, message, templateData = null) {
    try {
      // Format phone number (ensure it doesn't have + or spaces)
      const formattedPhone = phoneNumber.replace(/[^\d]/g, '');

      // Prepare the message payload
      let messagePayload;

      if (templateData) {
        // Using WhatsApp template (for approved templates)
        messagePayload = {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: {
            name: templateData.name,
            language: {
              code: templateData.languageCode || 'en',
            },
            components: templateData.components || [],
          },
        };
      } else {
        // Using text message (may require pre-approved template in production)
        messagePayload = {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        };
      }

      // Send message via WhatsApp Cloud API
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        messagePayload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      // Log successful message
      const logEntry = {
        timestamp: new Date().toISOString(),
        phone: formattedPhone,
        status: 'success',
        messageId: response.data.messages?.[0]?.id || 'unknown',
        response: response.data,
      };
      this.messageLogs.push(logEntry);

      console.log(`✅ WhatsApp message sent to ${formattedPhone}:`, response.data);
      
      return {
        success: true,
        messageId: response.data.messages?.[0]?.id,
        response: response.data,
      };
    } catch (error) {
      // Log failed message
      const logEntry = {
        timestamp: new Date().toISOString(),
        phone: phoneNumber,
        status: 'failed',
        error: error.response?.data || error.message,
      };
      this.messageLogs.push(logEntry);

      console.error('❌ Failed to send WhatsApp message:', {
        phone: phoneNumber,
        error: error.response?.data || error.message,
      });

      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Send message with retry logic
   * @param {string} phoneNumber 
   * @param {string} message 
   * @param {number} maxRetries 
   * @returns {Object}
   */
  async sendMessageWithRetry(phoneNumber, message, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.sendMessage(phoneNumber, message);
      
      if (result.success) {
        return result;
      }
      
      lastError = result.error;
      console.log(`🔄 Retry attempt ${attempt}/${maxRetries} for ${phoneNumber}`);
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    return {
      success: false,
      error: lastError,
    };
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber 
   * @returns {boolean}
   */
  validatePhoneNumber(phoneNumber) {
    // Check if phone number contains only digits and is at least 10 digits
    const cleaned = phoneNumber.replace(/[^\d]/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  /**
   * Get message logs
   * @param {number} limit - Number of logs to return
   * @returns {Array}
   */
  getMessageLogs(limit = 100) {
    return this.messageLogs.slice(-limit).reverse();
  }

  /**
   * Clear message logs
   */
  clearMessageLogs() {
    this.messageLogs = [];
    console.log('🗑️ Message logs cleared');
  }

  /**
   * Format message with placeholders
   * @param {string} template - Message template with placeholders
   * @param {Object} data - Data to replace placeholders
   * @returns {string}
   */
  formatMessage(template, data) {
    let message = template;
    
    // Replace placeholders like {{teacher_name}}, {{student_name}}, etc.
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(placeholder, data[key]);
    });
    
    return message;
  }

  /**
   * Check API health
   * @returns {Object}
   */
  async checkHealth() {
    try {
      // Try to get phone number info to verify API token
      const response = await axios.get(
        `${this.apiUrl}/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
          },
          timeout: 5000,
        }
      );
      
      return {
        healthy: true,
        phoneNumber: response.data,
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.response?.data || error.message,
      };
    }
  }
}

export default new WhatsAppService();
