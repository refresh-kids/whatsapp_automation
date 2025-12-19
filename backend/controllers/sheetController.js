import googleSheetsService from '../services/googleSheetsService.js';

/**
 * Get all messages from Google Sheet
 */
export const getAllMessages = async (req, res) => {
  try {
    const messages = await googleSheetsService.readSheet();
    
    res.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    console.error('❌ Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message,
    });
  }
};

/**
 * Get pending messages
 */
export const getPendingMessages = async (req, res) => {
  try {
    const messages = await googleSheetsService.getPendingMessages();
    
    res.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    console.error('❌ Error getting pending messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending messages',
      error: error.message,
    });
  }
};

/**
 * Get dashboard statistics
 */
export const getStats = async (req, res) => {
  try {
    const stats = await googleSheetsService.getStats();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

/**
 * Manually sync Google Sheet
 */
export const syncSheet = async (req, res) => {
  try {
    googleSheetsService.resetLastProcessedRow();
    const messages = await googleSheetsService.readSheet();
    
    res.json({
      success: true,
      message: 'Sheet synced successfully',
      data: {
        count: messages.length,
        syncedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error syncing sheet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync sheet',
      error: error.message,
    });
  }
};
