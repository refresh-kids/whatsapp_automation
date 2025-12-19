import { useState } from 'react';
import axios from '../api/axios';

export default function ImportCSV() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Please select a valid CSV file' });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: 'Please drop a valid CSV file' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post('/csv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ 
        type: 'success', 
        text: `${response.data.message}${response.data.errors ? ` (${response.data.errors.length} errors)` : ''}` 
      });
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('csvFileInput');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload CSV file' 
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get('/csv/template', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'whatsapp_messages_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to download template' 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Import Messages from CSV</h1>

      {/* Info Box */}
      <div className="card mb-6 bg-blue-50">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">📋 CSV Format Requirements</h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Required columns:</strong> phone_number, message, scheduled_time</li>
          <li>• <strong>Optional column:</strong> recipient_name</li>
          <li>• <strong>Phone format:</strong> Include country code (e.g., 919876543210)</li>
          <li>• <strong>Date format:</strong> YYYY-MM-DD HH:MM:SS (e.g., 2025-12-20 10:00:00)</li>
          <li>• <strong>Message placeholders:</strong> Use {'{{name}}'} for recipient name</li>
        </ul>
        <button
          onClick={downloadTemplate}
          className="btn-secondary mt-4"
        >
          📥 Download CSV Template
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Upload Area */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="space-y-4">
            <div className="text-6xl">📄</div>
            
            {file ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-green-600">
                  ✓ {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-700">
                  Drag & drop your CSV file here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse
                </p>
              </div>
            )}

            <input
              id="csvFileInput"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <label
              htmlFor="csvFileInput"
              className="inline-block px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
            >
              Browse Files
            </label>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn-primary"
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload and Import'}
          </button>

          {file && (
            <button
              onClick={() => {
                setFile(null);
                setMessage({ type: '', text: '' });
                const fileInput = document.getElementById('csvFileInput');
                if (fileInput) fileInput.value = '';
              }}
              className="btn-secondary"
            >
              ✖ Clear
            </button>
          )}
        </div>
      </div>

      {/* Example Section */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Example CSV Content</h2>
        <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
          <pre className="text-xs font-mono">
{`phone_number,recipient_name,message,scheduled_time
919876543210,John Doe,Hello {{name}}! This is your reminder.,2025-12-20 10:00:00
919876543211,Jane Smith,Hi {{name}}! Your appointment is confirmed.,2025-12-20 11:30:00
919876543212,Bob Wilson,Dear {{name}}, your meeting is scheduled.,2025-12-20 14:00:00`}
          </pre>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• The system will automatically send messages 15 minutes before scheduled time</li>
          <li>• Make sure your Google Sheet is properly configured in Settings</li>
          <li>• Phone numbers will be validated during import</li>
          <li>• Invalid rows will be skipped with error details</li>
          <li>• Maximum file size: 5MB</li>
        </ul>
      </div>
    </div>
  );
}
