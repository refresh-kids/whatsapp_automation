import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, schedulerRes] = await Promise.all([
        api.get('/sheet/stats'),
        api.get('/scheduler/status'),
      ]);
      setStats(statsRes.data.data);
      setSchedulerStatus(schedulerRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post('/sheet/sync');
      await fetchData();
      alert('Sheet synced successfully!');
    } catch (error) {
      alert('Failed to sync sheet: ' + (error.response?.data?.message || error.message));
    } finally {
      setSyncing(false);
    }
  };

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await api.post('/scheduler/trigger');
      await fetchData();
      alert('Message check triggered successfully!');
    } catch (error) {
      alert('Failed to trigger check: ' + (error.response?.data?.message || error.message));
    } finally {
      setTriggering(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="loading-spinner h-16 w-16 border-blue-600"></div>
            <p className="mt-4 text-gray-600 animate-pulse">Loading dashboard...</p>
          </div>
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
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              WhatsApp Automation Overview
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleTrigger}
              disabled={triggering}
              className="btn btn-secondary group relative overflow-hidden"
            >
              <span className={triggering ? 'animate-spin' : ''}>🔄</span>
              {triggering ? ' Triggering...' : ' Trigger Check'}
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="btn btn-primary group relative overflow-hidden"
            >
              <span className={syncing ? 'animate-spin' : ''}>🔄</span>
              {syncing ? ' Syncing...' : ' Sync Sheet'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-l-4 border-blue-500 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Messages</p>
                <p className="text-4xl font-bold text-blue-900 mt-3">{stats?.total || 0}</p>
                <p className="text-xs text-blue-500 mt-2">All time</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 border-l-4 border-yellow-500 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-bold text-yellow-900 mt-3">{stats?.pending || 0}</p>
                <p className="text-xs text-yellow-500 mt-2">Awaiting schedule</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-l-4 border-green-500 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Sent</p>
                <p className="text-4xl font-bold text-green-900 mt-3">{stats?.sent || 0}</p>
                <p className="text-xs text-green-500 mt-2">Successfully delivered</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-l-4 border-red-500 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">Failed</p>
                <p className="text-4xl font-bold text-red-900 mt-3">{stats?.failed || 0}</p>
                <p className="text-xs text-red-500 mt-2">Needs attention</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Scheduler Status
            </h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${schedulerStatus?.running ? 'bg-gradient-to-r from-green-400 to-green-500 text-white animate-pulse' : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'}`}>
              {schedulerStatus?.running ? '🟢 Running' : '🔴 Stopped'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-sm text-gray-600 mb-1">Next Check</p>
              <p className="text-lg font-bold text-purple-600">{schedulerStatus?.nextCheck || 'N/A'}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-sm text-gray-600 mb-1">Last Sync</p>
              <p className="text-lg font-bold text-pink-600">{schedulerStatus?.lastSync || 'N/A'}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-sm text-gray-600 mb-1">Messages Processed</p>
              <p className="text-lg font-bold text-indigo-600">{schedulerStatus?.messagesProcessed || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
