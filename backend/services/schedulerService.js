import cron from 'node-cron';
import googleSheetsService from './googleSheetsService.js';
import whatsappService from './whatsappService.js';
import config from '../config/config.js';

class SchedulerService {
  constructor() {
    this.isRunning = false;
    this.lastSync = null;
    this.lastCheck = null;
    this.messagesSent = 0;
    this.messagesFailed = 0;
    this.syncTask = null;
    this.checkTask = null;
  }

  /**
   * Start the scheduler
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️ Scheduler is already running');
      return;
    }

    console.log('🚀 Starting scheduler...');
    
    // Schedule message checking (every minute)
    const checkCron = `*/${config.scheduler.checkInterval} * * * *`;
    this.checkTask = cron.schedule(checkCron, async () => {
      await this.checkAndSendMessages();
    });

    // Schedule sheet sync (every 5 minutes or configured interval)
    const syncCron = `*/${config.scheduler.syncInterval} * * * *`;
    this.syncTask = cron.schedule(syncCron, async () => {
      await this.syncSheet();
    });

    this.isRunning = true;
    console.log(`✅ Scheduler started (Check: every ${config.scheduler.checkInterval}min, Sync: every ${config.scheduler.syncInterval}min)`);
    
    // Run initial check immediately
    this.checkAndSendMessages();
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Scheduler is not running');
      return;
    }

    if (this.checkTask) {
      this.checkTask.stop();
    }
    if (this.syncTask) {
      this.syncTask.stop();
    }

    this.isRunning = false;
    console.log('🛑 Scheduler stopped');
  }

  /**
   * Check for pending messages and send them
   */
  async checkAndSendMessages() {
    try {
      console.log('🔍 Checking for messages to send...');
      this.lastCheck = new Date();

      const pendingMessages = await googleSheetsService.getPendingMessages();
      
      if (pendingMessages.length === 0) {
        console.log('✅ No messages to send at this time');
        return;
      }

      console.log(`📤 Found ${pendingMessages.length} message(s) to send`);

      for (const message of pendingMessages) {
        await this.processMessage(message);
      }

      console.log(`✅ Processed ${pendingMessages.length} message(s)`);
    } catch (error) {
      console.error('❌ Error in checkAndSendMessages:', error.message);
    }
  }

  /**
   * Process a single message
   * @param {Object} messageData - Message data from Google Sheet
   */
  async processMessage(messageData) {
    try {
      const { 
        rowIndex, 
        phone_number, 
        message, 
        teacher_name, 
        student_name,
        meeting_date,
        meeting_time 
      } = messageData;

      console.log(`📨 Processing message for ${student_name} (${phone_number})`);

      // Validate phone number
      if (!whatsappService.validatePhoneNumber(phone_number)) {
        console.error(`❌ Invalid phone number: ${phone_number}`);
        await googleSheetsService.updateRowStatus(rowIndex, 'Failed', new Date().toISOString());
        this.messagesFailed++;
        return;
      }

      // Format message with data
      const formattedMessage = whatsappService.formatMessage(message, {
        teacher_name,
        student_name,
        meeting_date,
        meeting_time,
      });

      // Send WhatsApp message with retry
      const result = await whatsappService.sendMessageWithRetry(
        phone_number, 
        formattedMessage,
        3 // Max retries
      );

      if (result.success) {
        // Update status to "Sent"
        await googleSheetsService.updateRowStatus(rowIndex, 'Sent', new Date().toISOString());
        this.messagesSent++;
        console.log(`✅ Message sent successfully to ${phone_number}`);
      } else {
        // Update status to "Failed"
        await googleSheetsService.updateRowStatus(rowIndex, 'Failed', new Date().toISOString());
        this.messagesFailed++;
        console.error(`❌ Failed to send message to ${phone_number}`);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error.message);
      
      // Update status to "Failed"
      try {
        await googleSheetsService.updateRowStatus(messageData.rowIndex, 'Failed', new Date().toISOString());
        this.messagesFailed++;
      } catch (updateError) {
        console.error('❌ Failed to update status:', updateError.message);
      }
    }
  }

  /**
   * Sync sheet data (refresh cache)
   */
  async syncSheet() {
    try {
      console.log('🔄 Syncing Google Sheet data...');
      this.lastSync = new Date();
      
      // Just trigger a read to refresh any caches
      await googleSheetsService.readSheet();
      
      console.log('✅ Sheet sync completed');
    } catch (error) {
      console.error('❌ Error syncing sheet:', error.message);
    }
  }

  /**
   * Manual trigger for checking messages
   */
  async triggerCheck() {
    console.log('🔄 Manual trigger: Checking messages...');
    await this.checkAndSendMessages();
  }

  /**
   * Manual trigger for syncing sheet
   */
  async triggerSync() {
    console.log('🔄 Manual trigger: Syncing sheet...');
    await this.syncSheet();
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastSync: this.lastSync,
      lastCheck: this.lastCheck,
      messagesSent: this.messagesSent,
      messagesFailed: this.messagesFailed,
      checkInterval: `${config.scheduler.checkInterval} minute(s)`,
      syncInterval: `${config.scheduler.syncInterval} minute(s)`,
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.messagesSent = 0;
    this.messagesFailed = 0;
    console.log('🔄 Statistics reset');
  }
}

export default new SchedulerService();
