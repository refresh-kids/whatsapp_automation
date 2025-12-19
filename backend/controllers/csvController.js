import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import googleSheetsService from '../services/googleSheetsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const uploadMiddleware = upload.single('csvFile');

// Upload and process CSV file
export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const results = [];
    const errors = [];
    let rowNumber = 0;

    // Parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        rowNumber++;
        
        // Validate required fields
        if (!row.phone_number || !row.message || !row.scheduled_time) {
          errors.push({
            row: rowNumber,
            error: 'Missing required fields (phone_number, message, scheduled_time)'
          });
          return;
        }

        // Validate phone number format
        const phone = row.phone_number.toString().replace(/\D/g, '');
        if (phone.length < 10) {
          errors.push({
            row: rowNumber,
            error: 'Invalid phone number format'
          });
          return;
        }

        results.push({
          phone_number: phone,
          recipient_name: row.recipient_name || '',
          message: row.message,
          scheduled_time: row.scheduled_time,
          status: 'pending'
        });
      })
      .on('end', async () => {
        try {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          if (results.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No valid rows found in CSV',
              errors
            });
          }

          // Add to Google Sheets
          await googleSheetsService.appendRows(results);

          res.json({
            success: true,
            message: `Successfully imported ${results.length} messages`,
            imported: results.length,
            errors: errors.length > 0 ? errors : undefined
          });
        } catch (error) {
          console.error('Error saving to Google Sheets:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to save to Google Sheets: ' + error.message
          });
        }
      })
      .on('error', (error) => {
        // Clean up uploaded file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
          success: false,
          message: 'Error parsing CSV: ' + error.message
        });
      });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error uploading CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload CSV: ' + error.message
    });
  }
};

// Download CSV template
export const downloadTemplate = (req, res) => {
  const template = `phone_number,recipient_name,message,scheduled_time
919876543210,John Doe,Hello {{name}}! This is your reminder.,2025-12-20 10:00:00
919876543211,Jane Smith,Hi {{name}}! Your appointment is confirmed.,2025-12-20 11:30:00`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=whatsapp_messages_template.csv');
  res.send(template);
};
