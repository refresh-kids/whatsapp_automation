import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('google-sheets');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [testing, setTesting] = useState(false);

  // Google Sheets form
  const [googleSheets, setGoogleSheets] = useState({
    sheetId: '',
    clientEmail: '',
    privateKey: ''
  });

  // WhatsApp form
  const [whatsApp, setWhatsApp] = useState({
    apiToken: '',
    phoneNumberId: '',
    businessAccountId: ''
  });

  // Load current settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get('/settings');
      const settings = response.data.settings;
      
      setGoogleSheets({
        sheetId: settings.GOOGLE_SHEET_ID || '',
        clientEmail: settings.GOOGLE_SHEETS_CLIENT_EMAIL || '',
        privateKey: settings.GOOGLE_SHEETS_PRIVATE_KEY === '***configured***' ? '' : settings.GOOGLE_SHEETS_PRIVATE_KEY || ''
      });

      setWhatsApp({
        apiToken: settings.WHATSAPP_API_TOKEN === '***configured***' ? '' : settings.WHATSAPP_API_TOKEN || '',
        phoneNumberId: settings.WHATSAPP_PHONE_NUMBER_ID || '',
        businessAccountId: settings.WHATSAPP_BUSINESS_ACCOUNT_ID || ''
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleGoogleSheetsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/settings/google-sheets', googleSheets);
      setMessage({ type: 'success', text: response.data.message });
      
      // Clear private key field after successful save
      setGoogleSheets(prev => ({ ...prev, privateKey: '' }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/settings/whatsapp', whatsApp);
      setMessage({ type: 'success', text: response.data.message });
      
      // Clear token field after successful save
      setWhatsApp(prev => ({ ...prev, apiToken: '' }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testGoogleSheetsConnection = async () => {
    setTesting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.get('/settings/test-google-sheets');
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Connection test failed' 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('google-sheets')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'google-sheets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 Google Sheets
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'whatsapp'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            💬 WhatsApp
          </button>
        </nav>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Google Sheets Tab */}
      {activeTab === 'google-sheets' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Google Sheets Configuration</h2>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📖 How to get credentials:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>Create a new project or select existing one</li>
              <li>Enable "Google Sheets API"</li>
              <li>Create Service Account (IAM & Admin → Service Accounts)</li>
              <li>Generate JSON key for the service account</li>
              <li>Copy the email and private key from the JSON file</li>
              <li>Share your Google Sheet with the service account email</li>
            </ol>
          </div>

          <form onSubmit={handleGoogleSheetsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Sheet ID *
              </label>
              <input
                type="text"
                value={googleSheets.sheetId}
                onChange={(e) => setGoogleSheets({ ...googleSheets, sheetId: e.target.value })}
                placeholder="From sheet URL: docs.google.com/spreadsheets/d/[SHEET_ID]/edit"
                className="input"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Found in your sheet URL after /d/
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Account Email *
              </label>
              <input
                type="email"
                value={googleSheets.clientEmail}
                onChange={(e) => setGoogleSheets({ ...googleSheets, clientEmail: e.target.value })}
                placeholder="your-service-account@project.iam.gserviceaccount.com"
                className="input"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                From your service account JSON file (client_email field)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Key *
              </label>
              <textarea
                value={googleSheets.privateKey}
                onChange={(e) => setGoogleSheets({ ...googleSheets, privateKey: e.target.value })}
                placeholder="-----BEGIN PRIVATE KEY-----&#10;Your private key here&#10;-----END PRIVATE KEY-----"
                className="input font-mono text-xs"
                rows="6"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                From your service account JSON file (private_key field). Include the full key with BEGIN/END markers.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : '💾 Save Configuration'}
              </button>

              <button
                type="button"
                onClick={testGoogleSheetsConnection}
                disabled={testing || !googleSheets.sheetId}
                className="btn-secondary"
              >
                {testing ? 'Testing...' : '🔍 Test Connection'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WhatsApp Tab */}
      {activeTab === 'whatsapp' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">WhatsApp Cloud API Configuration</h2>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📖 How to get credentials:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="underline">Meta for Developers</a></li>
              <li>Create a new app or select existing one</li>
              <li>Add "WhatsApp" product to your app</li>
              <li>Go to WhatsApp → Getting Started</li>
              <li>Copy your Phone Number ID</li>
              <li>Generate an Access Token</li>
              <li>Test by sending a message through their interface</li>
            </ol>
          </div>

          <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token *
              </label>
              <input
                type="text"
                value={whatsApp.apiToken}
                onChange={(e) => setWhatsApp({ ...whatsApp, apiToken: e.target.value })}
                placeholder="Enter your WhatsApp Cloud API access token"
                className="input font-mono"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Get from Meta for Developers dashboard → WhatsApp → Getting Started
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number ID *
              </label>
              <input
                type="text"
                value={whatsApp.phoneNumberId}
                onChange={(e) => setWhatsApp({ ...whatsApp, phoneNumberId: e.target.value })}
                placeholder="Enter your phone number ID"
                className="input"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Found in WhatsApp → API Setup → Phone Number ID
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Account ID (Optional)
              </label>
              <input
                type="text"
                value={whatsApp.businessAccountId}
                onChange={(e) => setWhatsApp({ ...whatsApp, businessAccountId: e.target.value })}
                placeholder="Enter your business account ID (optional)"
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Found in your app settings
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : '💾 Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Need Help?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• After saving, the server may need to be restarted</li>
          <li>• Make sure to share your Google Sheet with the service account email</li>
          <li>• Test the connection after saving to verify everything works</li>
          <li>• Keep your credentials secure and never share them publicly</li>
        </ul>
      </div>
    </div>
  );
}
