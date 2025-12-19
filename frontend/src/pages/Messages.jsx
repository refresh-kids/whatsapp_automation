import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/sheet/messages');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'pending') {
      return <span className="badge badge-pending">Pending</span>;
    } else if (statusLower === 'sent') {
      return <span className="badge badge-sent">Sent</span>;
    } else if (statusLower === 'failed') {
      return <span className="badge badge-failed">Failed</span>;
    }
    return <span className="badge">{status}</span>;
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true;
    return msg.status.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="loading-spinner h-16 w-16 border-blue-600"></div>
          <p className="text-gray-600 animate-pulse">Loading messages...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 page-transition">
        <div className="flex justify-between items-center animate-slide-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="text-xl">💬</span>
              View and manage all scheduled messages
            </p>
          </div>
          <button onClick={fetchMessages} className="btn btn-primary group">
            <span className="group-hover:animate-spin inline-block">🔄</span> Refresh
          </button>
        </div>

        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 animate-slide-in">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' : 'bg-white text-gray-700 hover:shadow-lg'}`}
            >
              📊 All <span className="ml-2 px-2 py-1 rounded-full bg-white bg-opacity-20 text-xs">{messages.length}</span>
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${filter === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg animate-pulse' : 'bg-white text-gray-700 hover:shadow-lg'}`}
            >
              ⏳ Pending <span className="ml-2 px-2 py-1 rounded-full bg-white bg-opacity-20 text-xs">{messages.filter(m => m.status.toLowerCase() === 'pending').length}</span>
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${filter === 'sent' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:shadow-lg'}`}
            >
              ✅ Sent <span className="ml-2 px-2 py-1 rounded-full bg-white bg-opacity-20 text-xs">{messages.filter(m => m.status.toLowerCase() === 'sent').length}</span>
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${filter === 'failed' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:shadow-lg'}`}
            >
              ❌ Failed <span className="ml-2 px-2 py-1 rounded-full bg-white bg-opacity-20 text-xs">{messages.filter(m => m.status.toLowerCase() === 'failed').length}</span>
            </button>
          </div>
        </div>

        <div className="card animate-slide-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Scheduled Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-3">
                        <span className="text-6xl opacity-50">📭</span>
                        <p className="text-lg font-medium">No messages found</p>
                        <p className="text-sm">Try changing the filter or add some messages</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((message, index) => (
                    <tr key={index} className="table-row">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{message.phone_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.recipient_name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">{message.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{message.scheduled_time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(message.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
