import React, { useCallback, useState, useEffect } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface FileUploadProps {
  onUploadComplete: (file: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Auto-reset error state after 5 seconds
  useEffect(() => {
    if (uploadStatus === 'error') {
      const timer = setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    setError(null);

    try {
      const result = await api.uploadFile(file, setUploadProgress);
      setUploadStatus('success');
      setUploadProgress(100);
      onUploadComplete(result);
      
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(null);
      }, 2000);
    } catch (err: any) {
      setUploadStatus('error');
      setError(err.message || 'Upload failed');
      setUploadProgress(null);
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadProgress(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30'
            : uploadStatus === 'success'
            ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30'
            : uploadStatus === 'error'
            ? 'border-red-300 bg-red-50 dark:bg-red-900/30'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          disabled={uploadStatus === 'uploading'}
          accept=".pdf,.txt,.doc,.docx,.md"
        />

        {uploadStatus === 'uploading' && (
          <div className="space-y-4">
            <Upload className="mx-auto h-8 w-8 text-blue-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress || 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(uploadProgress || 0)}%</p>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="space-y-2">
            <CheckCircle className="mx-auto h-8 w-8 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Upload successful!</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="space-y-2">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Upload failed</p>
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            <p className="text-xs text-gray-500 dark:text-gray-400">Will reset automatically in 5 seconds</p>
            <button
              onClick={resetUpload}
              className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X className="w-3 h-3 mr-1" />
              Dismiss
            </button>
          </div>
        )}

        {uploadStatus === 'idle' && (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports PDF, TXT, DOC, DOCX, MD files
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};