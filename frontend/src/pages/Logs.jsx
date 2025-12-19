import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../api/axios';
import Layout from '../components/Layout';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/scheduler/logs');
      setLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      try {
        await api.delete('/scheduler/logs');
        setLogs([]);
        alert('Logs cleared successfully!');
      } catch (error) {
        alert('Failed to clear logs: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Message Logs</h1>
            <p className="text-gray-600 mt-1">
              View all WhatsApp message send attempts
            </p>
          </div>
          <div className="flex space-x-3">
            <button onClick={fetchLogs} className="btn btn-secondary">
              🔄 Refresh
            </button>
            <button onClick={handleClearLogs} className="btn btn-danger">
              🗑️ Clear Logs
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity ({logs.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No logs available
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`px-6 py-4 hover:bg-gray-50 ${
                    log.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {log.status === 'success' ? (
                          <span className="text-green-600 text-lg">✅</span>
                        ) : (
                          <span className="text-red-600 text-lg">❌</span>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {log.status === 'success'
                              ? 'Message Sent Successfully'
                              : 'Message Failed'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Phone: {log.phone}
                          </p>
                          {log.messageId && (
                            <p className="text-xs text-gray-600">
                              Message ID: {log.messageId}
                            </p>
                          )}
                          {log.error && (
                            <p className="text-xs text-red-600 mt-1">
                              Error: {JSON.stringify(log.error)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span className="text-gray-600">Message sent successfully</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-600">❌</span>
              <span className="text-gray-600">Message failed to send</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Logs;
