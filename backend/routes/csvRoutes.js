import express from 'express';
import * as csvController from '../controllers/csvController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Upload CSV file
router.post('/upload', csvController.uploadMiddleware, csvController.uploadCSV);

// Download CSV template
router.get('/template', csvController.downloadTemplate);

export default router;
