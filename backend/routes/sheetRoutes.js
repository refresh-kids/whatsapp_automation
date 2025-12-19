import express from 'express';
import {
  getAllMessages,
  getPendingMessages,
  getStats,
  syncSheet,
} from '../controllers/sheetController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/sheet/messages
 * @desc    Get all messages from Google Sheet
 * @access  Private
 */
router.get('/messages', getAllMessages);

/**
 * @route   GET /api/sheet/pending
 * @desc    Get pending messages
 * @access  Private
 */
router.get('/pending', getPendingMessages);

/**
 * @route   GET /api/sheet/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', getStats);

/**
 * @route   POST /api/sheet/sync
 * @desc    Manually sync Google Sheet
 * @access  Private
 */
router.post('/sync', syncSheet);

export default router;
