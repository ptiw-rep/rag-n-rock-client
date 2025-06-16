import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, Menu, X, Upload as UploadIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { ChatInterface } from './components/ChatInterface';
import { AdminModal } from './components/AdminModal';
import { LoginForm } from './components/LoginForm';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FileListItem } from './types/api';
import { api } from './services/api';

type Tab = 'chat' | 'files';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [files, setFiles] = useState<FileListItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const loadFiles = async () => {
    if (!user) return;
    
    setIsLoadingFiles(true);
    try {
      const fileList = await api.listFiles();
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user]);

  const handleFileUpload = (uploadedFile: any) => {
    loadFiles();
    setActiveTab('files');
  };

  const handleFileDelete = async (fileId: number) => {
    try {
      await api.deleteFile(fileId);
      if (selectedFileId === fileId) {
        setSelectedFileId(null);
      }
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleFileSelect = (fileId: number | null) => {
    setSelectedFileId(fileId);
    setActiveTab('chat');
    setIsMobileSidebarOpen(false);
  };

  const handleLogoDoubleClick = () => {
    setShowAdminModal(true);
  };

  const selectedFile = files.find(f => f.id === selectedFileId);

  const tabs = [
    { id: 'chat' as Tab, label: 'Chat', icon: MessageSquare },
    { id: 'files' as Tab, label: 'Files', icon: FileText },
  ];

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Admin Modal */}
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3" onDoubleClick={handleLogoDoubleClick}>
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">RAG-&-Rock</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Document AI Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className={`${
          isMobileSidebarOpen ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden'
        } lg:block ${isSidebarOpen ? 'w-full lg:w-80' : 'w-0 lg:w-16'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
          
          {/* Desktop Header */}
          <div className="hidden lg:block p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {isSidebarOpen && (
                <div className="flex items-center space-x-3" onDoubleClick={handleLogoDoubleClick}>
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">RAG-&-Rock</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Document AI Assistant</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile close overlay */}
          {isMobileSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Sidebar content */}
          <div className="relative z-50 bg-white dark:bg-gray-900 flex flex-col h-full lg:h-auto">
            {/* Mobile header in sidebar */}
            <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            {(isSidebarOpen || isMobileSidebarOpen) && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab Content */}
            {(isSidebarOpen || isMobileSidebarOpen) && (
              <div className="flex-1 p-4 overflow-y-auto">
                {activeTab === 'files' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Upload Document
                      </h3>
                      <FileUpload onUploadComplete={handleFileUpload} />
                    </div>
                    
                    <div>
                      <FileList
                        files={files}
                        selectedFileId={selectedFileId}
                        onFileSelect={handleFileSelect}
                        onFileDelete={handleFileDelete}
                        isLoading={isLoadingFiles}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Chat Context</h3>
                      {selectedFile ? (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
                              {selectedFile.filename}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedFileId(null)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-1"
                          >
                            Chat with all files instead
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Chatting with all uploaded documents</p>
                          <button
                            onClick={() => setActiveTab('files')}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-1"
                          >
                            Select a specific file
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Upload</h3>
                      <FileUpload onUploadComplete={handleFileUpload} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-4 lg:p-6">
            {activeTab === 'chat' && (
              <ChatInterface selectedFileId={selectedFileId} files={files} />
            )}
            
            {activeTab === 'files' && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">File Management</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Use the sidebar to upload and manage your documents
                  </p>
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="lg:hidden inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Menu className="h-4 w-4 mr-2" />
                    Open Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;