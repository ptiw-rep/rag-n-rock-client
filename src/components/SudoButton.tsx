import React, { useState } from 'react';
import { Terminal, Shield, X } from 'lucide-react';
import { AdminPanel } from './AdminPanel';

interface SudoButtonProps {
  isVisible: boolean;
  onHide: () => void;
}

export const SudoButton: React.FC<SudoButtonProps> = ({ isVisible, onHide }) => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  if (!isVisible && !showAdminPanel) return null;

  if (showAdminPanel) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Terminal className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sudo Admin Panel</h2>
                <p className="text-sm text-gray-600">Administrative privileges granted</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowAdminPanel(false);
                onHide();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <AdminPanel />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-4 right-4 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <button
        onClick={() => setShowAdminPanel(true)}
        className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
      >
        <Terminal className="h-4 w-4" />
        <span className="font-mono text-sm font-medium">sudo</span>
        <Shield className="h-4 w-4 opacity-75 group-hover:opacity-100 transition-opacity" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Access admin panel
      </div>
    </div>
  );
};