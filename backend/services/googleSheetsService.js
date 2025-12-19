import { google } from 'googleapis';
import config from '../config/config.js';

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.auth = null;
    this.lastProcessedRow = 1; // Start from row 2 (skip header)
    this.initialize();
  }

  /**
   * Initialize Google Sheets API authentication
   */
  async initialize() {
    try {
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: config.googleSheets.clientEmail,
          private_key: config.googleSheets.privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('✅ Google Sheets API initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets API:', error.message);
      throw error;
    }
  }

  /**
   * Read all data from Google Sheet
   * @returns {Array} Array of row objects
   */
  async readSheet() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: config.googleSheets.sheetId,
        range: 'Sheet1!A:H', // Columns A to H
      });

      const rows = response.data.values;
      
      if (!rows || rows.length === 0) {
        return [];
      }

      // Skip header row
      const header = rows[0];
      const data = rows.slice(1).map((row, index) => ({
        rowIndex: index + 2, // +2 because: skip header (1) and arrays are 0-indexed
        teacher_name: row[0] || '',
        student_name: row[1] || '',
        phone_number: row[2] || '',
        message: row[3] || '',
        meeting_date: row[4] || '',
        meeting_time: row[5] || '',
        status: row[6] || 'Pending',
        sent_at: row[7] || '',
      }));

      return data;
    } catch (error) {
      console.error('❌ Error reading Google Sheet:', error.message);
      throw error;
    }
  }

  /**
   * Get pending messages that need to be sent
   * @returns {Array} Array of messages ready to send
   */
  async getPendingMessages() {
    try {
      const allData = await this.readSheet();
      const currentTime = new Date();

      const pendingMessages = allData.filter((row) => {
        if (row.status.toLowerCase() !== 'pending') {
          return false;
        }

        // Calculate trigger time (15 minutes before meeting)
        const meetingDateTime = new Date(`${row.meeting_date}T${row.meeting_time}`);
        const triggerTime = new Date(meetingDateTime.getTime() - 15 * 60 * 1000);

        // Check if it's time to send
        return currentTime >= triggerTime && row.rowIndex > this.lastProcessedRow;
      });

      return pendingMessages;
    } catch (error) {
      console.error('❌ Error getting pending messages:', error.message);
      throw error;
    }
  }

  /**
   * Update status of a specific row
   * @param {number} rowIndex - Row number in sheet (1-indexed)
   * @param {string} status - New status (Sent/Failed)
   * @param {string} sentAt - Timestamp of when message was sent
   */
  async updateRowStatus(rowIndex, status, sentAt = '') {
    try {
      const timestamp = sentAt || new Date().toISOString();
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: config.googleSheets.sheetId,
        range: `Sheet1!G${rowIndex}:H${rowIndex}`, // Status and sent_at columns
        valueInputOption: 'RAW',
        resource: {
          values: [[status, timestamp]],
        },
      });

      console.log(`✅ Updated row ${rowIndex} status to: ${status}`);
      
      // Update last processed row
      if (rowIndex > this.lastProcessedRow) {
        this.lastProcessedRow = rowIndex;
      }
    } catch (error) {
      console.error(`❌ Error updating row ${rowIndex}:`, error.message);
      throw error;
    }
  }

  /**
   * Get statistics from sheet
   * @returns {Object} Stats object
   */
  async getStats() {
    try {
      const allData = await this.readSheet();
      
      const stats = {
        total: allData.length,
        pending: allData.filter(row => row.status.toLowerCase() === 'pending').length,
        sent: allData.filter(row => row.status.toLowerCase() === 'sent').length,
        failed: allData.filter(row => row.status.toLowerCase() === 'failed').length,
      };

      return stats;
    } catch (error) {
      console.error('❌ Error getting stats:', error.message);
      throw error;
    }
  }

  /**
   * Reset last processed row (for manual sync)
   */
  resetLastProcessedRow() {
    this.lastProcessedRow = 1;
    console.log('🔄 Reset last processed row');
  }

  /**
   * Append new rows to the sheet
   */
  async appendRows(rows) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      // Convert rows to array format
      const values = rows.map(row => [
        row.phone_number,
        row.recipient_name || '',
        row.message,
        row.scheduled_time,
        row.status || 'pending'
      ]);

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: config.googleSheetId,
        range: 'Sheet1!A:E',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values
        }
      });

      console.log(`✅ Appended ${values.length} rows to Google Sheet`);
      return response.data;
    } catch (error) {
      console.error('❌ Error appending rows to Google Sheet:', error.message);
      throw error;
    }
  }
}

export default new GoogleSheetsService();
