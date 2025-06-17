import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Activity, AlertTriangle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../services/api';

export const AdminPanel: React.FC = () => {
  const [adminToken, setAdminToken] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [clearResult, setClearResult] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    setError(null);
    try {
      const status = await api.healthCheck();
      setHealthStatus(status);
    } catch (err: any) {
      setError(err.message);
      setHealthStatus(null);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleClearAll = async () => {
    if (!adminToken.trim()) {
      setError('Admin token is required');
      return;
    }

    if (!confirm('⚠️ DANGER: This will permanently delete ALL files and chat history. Are you absolutely sure?')) {
      return;
    }

    setIsClearing(true);
    setError(null);
    setClearResult(null);

    try {
      const result = await api.adminClearAll(adminToken);
      setClearResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsClearing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'emerald';
      case 'degraded':
        return 'yellow';
      case 'unhealthy':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (isOk: boolean) => {
    return isOk ? CheckCircle : XCircle;
  };

  const getStatusText = (isOk: boolean) => {
    return isOk ? 'Operational' : 'Failed';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">System administration and management</p>
        </div>
      </div>

      {/* Health Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            System Health
          </h3>
          <button
            onClick={checkHealth}
            disabled={isCheckingHealth}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isCheckingHealth ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {healthStatus ? (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className={`p-4 rounded-lg border ${
              healthStatus.status === 'ok' 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
                : healthStatus.status === 'degraded'
                ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  healthStatus.status === 'ok' 
                    ? 'bg-emerald-500'
                    : healthStatus.status === 'degraded'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}></div>
                <div>
                  <p className={`text-sm font-medium ${
                    healthStatus.status === 'ok' 
                      ? 'text-emerald-800 dark:text-emerald-200'
                      : healthStatus.status === 'degraded'
                      ? 'text-yellow-800 dark:text-yellow-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    System Status: {healthStatus.status.charAt(0).toUpperCase() + healthStatus.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Individual Components */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Database */}
              <div className={`p-4 rounded-lg border ${
                healthStatus.db?.ok 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center">
                  {React.createElement(getStatusIcon(healthStatus.db?.ok), {
                    className: `h-5 w-5 mr-3 ${healthStatus.db?.ok ? 'text-emerald-500' : 'text-red-500'}`
                  })}
                  <div>
                    <p className={`text-sm font-medium ${
                      healthStatus.db?.ok 
                        ? 'text-emerald-800 dark:text-emerald-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      Database
                    </p>
                    <p className={`text-xs ${
                      healthStatus.db?.ok 
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {healthStatus.db?.msg || getStatusText(healthStatus.db?.ok)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vector Store */}
              <div className={`p-4 rounded-lg border ${
                healthStatus.vectorstore?.ok 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center">
                  {React.createElement(getStatusIcon(healthStatus.vectorstore?.ok), {
                    className: `h-5 w-5 mr-3 ${healthStatus.vectorstore?.ok ? 'text-emerald-500' : 'text-red-500'}`
                  })}
                  <div>
                    <p className={`text-sm font-medium ${
                      healthStatus.vectorstore?.ok 
                        ? 'text-emerald-800 dark:text-emerald-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      Vector Store
                    </p>
                    <p className={`text-xs ${
                      healthStatus.vectorstore?.ok 
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {healthStatus.vectorstore?.msg || getStatusText(healthStatus.vectorstore?.ok)}
                    </p>
                  </div>
                </div>
              </div>

              {/* LLM */}
              <div className={`p-4 rounded-lg border ${
                healthStatus.llm?.ok 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center">
                  {React.createElement(getStatusIcon(healthStatus.llm?.ok), {
                    className: `h-5 w-5 mr-3 ${healthStatus.llm?.ok ? 'text-emerald-500' : 'text-red-500'}`
                  })}
                  <div>
                    <p className={`text-sm font-medium ${
                      healthStatus.llm?.ok 
                        ? 'text-emerald-800 dark:text-emerald-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      LLM {healthStatus.llm?.model ? `(${healthStatus.llm.model})` : ''}
                    </p>
                    <p className={`text-xs ${
                      healthStatus.llm?.ok 
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {healthStatus.llm?.msg || getStatusText(healthStatus.llm?.ok)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Health Check Failed</p>
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        )}
      </div>

      {/* Clear All Data */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-red-900 dark:text-red-200">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="adminToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Admin Token
            </label>
            <input
              type="password"
              id="adminToken"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Enter admin token..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Clear All Data</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  This action will permanently delete ALL uploaded files, chat history, and vector embeddings. This cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleClearAll}
            disabled={isClearing || !adminToken.trim()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isClearing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {isClearing ? 'Clearing...' : 'Clear All Data'}
          </button>
        </div>

        {clearResult && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Operation Completed</h4>
            <ul className="text-sm text-green-700 dark:text-green-300 mt-1 space-y-1">
              <li>• Files deleted: {clearResult.files_deleted}</li>
              <li>• Chats deleted: {clearResult.chats_deleted}</li>
              <li>• Status: {clearResult.status}</li>
            </ul>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};