import schedulerService from '../services/schedulerService.js';
import whatsappService from '../services/whatsappService.js';

/**
 * Get scheduler status
 */
export const getSchedulerStatus = (req, res) => {
  try {
    const status = schedulerService.getStatus();
    
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('❌ Error getting scheduler status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduler status',
      error: error.message,
    });
  }
};

/**
 * Manually trigger message check
 */
export const triggerCheck = async (req, res) => {
  try {
    await schedulerService.triggerCheck();
    
    res.json({
      success: true,
      message: 'Message check triggered successfully',
      data: {
        triggeredAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error triggering check:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger message check',
      error: error.message,
    });
  }
};

/**
 * Get message logs
 */
export const getMessageLogs = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = whatsappService.getMessageLogs(limit);
    
    res.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('❌ Error getting message logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message logs',
      error: error.message,
    });
  }
};

/**
 * Clear message logs
 */
export const clearMessageLogs = (req, res) => {
  try {
    whatsappService.clearMessageLogs();
    
    res.json({
      success: true,
      message: 'Message logs cleared successfully',
    });
  } catch (error) {
    console.error('❌ Error clearing message logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear message logs',
      error: error.message,
    });
  }
};

/**
 * Check WhatsApp API health
 */
export const checkWhatsAppHealth = async (req, res) => {
  try {
    const health = await whatsappService.checkHealth();
    
    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error('❌ Error checking WhatsApp health:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check WhatsApp API health',
      error: error.message,
    });
  }
};
