import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get current configuration
export const getSettings = async (req, res) => {
  try {
    const envPath = path.join(__dirname, '../.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse .env file
    const settings = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#')) {
        const value = valueParts.join('=').trim();
        // Don't send sensitive data in full
        if (key.includes('KEY') || key.includes('TOKEN') || key.includes('PASSWORD')) {
          settings[key] = value ? '***configured***' : '';
        } else {
          settings[key] = value.replace(/"/g, '');
        }
      }
    });

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read settings'
    });
  }
};

// Update Google Sheets configuration
export const updateGoogleSheets = async (req, res) => {
  try {
    const { sheetId, clientEmail, privateKey } = req.body;

    if (!sheetId || !clientEmail || !privateKey) {
      return res.status(400).json({
        success: false,
        message: 'Sheet ID, Client Email, and Private Key are required'
      });
    }

    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update or add the values
    envContent = updateEnvValue(envContent, 'GOOGLE_SHEET_ID', sheetId);
    envContent = updateEnvValue(envContent, 'GOOGLE_SHEETS_CLIENT_EMAIL', clientEmail);
    envContent = updateEnvValue(envContent, 'GOOGLE_SHEETS_PRIVATE_KEY', `"${privateKey}"`);

    fs.writeFileSync(envPath, envContent);

    // Reinitialize Google Sheets service
    const googleSheetsService = await import('../services/googleSheetsService.js');
    await googleSheetsService.default.initialize();

    res.json({
      success: true,
      message: 'Google Sheets configuration updated successfully. Please restart the server for changes to take full effect.'
    });
  } catch (error) {
    console.error('Error updating Google Sheets settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings: ' + error.message
    });
  }
};

// Update WhatsApp configuration
export const updateWhatsApp = async (req, res) => {
  try {
    const { apiToken, phoneNumberId, businessAccountId } = req.body;

    if (!apiToken || !phoneNumberId) {
      return res.status(400).json({
        success: false,
        message: 'API Token and Phone Number ID are required'
      });
    }

    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update or add the values
    envContent = updateEnvValue(envContent, 'WHATSAPP_API_TOKEN', apiToken);
    envContent = updateEnvValue(envContent, 'WHATSAPP_PHONE_NUMBER_ID', phoneNumberId);
    if (businessAccountId) {
      envContent = updateEnvValue(envContent, 'WHATSAPP_BUSINESS_ACCOUNT_ID', businessAccountId);
    }

    fs.writeFileSync(envPath, envContent);

    res.json({
      success: true,
      message: 'WhatsApp configuration updated successfully. Please restart the server for changes to take full effect.'
    });
  } catch (error) {
    console.error('Error updating WhatsApp settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings: ' + error.message
    });
  }
};

// Test Google Sheets connection
export const testGoogleSheets = async (req, res) => {
  try {
    const googleSheetsService = await import('../services/googleSheetsService.js');
    const data = await googleSheetsService.default.readSheet();
    
    res.json({
      success: true,
      message: `Successfully connected! Found ${data.length} rows in the sheet.`,
      rowCount: data.length
    });
  } catch (error) {
    console.error('Error testing Google Sheets:', error);
    res.status(500).json({
      success: false,
      message: 'Connection failed: ' + error.message
    });
  }
};

// Helper function to update or add env value
function updateEnvValue(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`);
  } else {
    return content + `\n${key}=${value}`;
  }
}

