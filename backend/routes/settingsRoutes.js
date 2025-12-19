import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get current settings
router.get('/', settingsController.getSettings);

// Update Google Sheets configuration
router.post('/google-sheets', settingsController.updateGoogleSheets);

// Update WhatsApp configuration
router.post('/whatsapp', settingsController.updateWhatsApp);

// Test Google Sheets connection
router.get('/test-google-sheets', settingsController.testGoogleSheets);

export default router;
