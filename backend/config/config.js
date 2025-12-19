import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Admin credentials
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  
  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '24h',
  
  // Google Sheets
  googleSheets: {
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    sheetId: process.env.GOOGLE_SHEET_ID,
  },
  
  // WhatsApp
  whatsapp: {
    apiToken: process.env.WHATSAPP_API_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    apiUrl: 'https://graph.facebook.com/v18.0',
  },
  
  // Scheduler
  scheduler: {
    syncInterval: parseInt(process.env.SYNC_INTERVAL_MINUTES || '5'),
    checkInterval: parseInt(process.env.CHECK_INTERVAL_MINUTES || '1'),
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};
