import React, { useState } from 'react';
import { FileText, Trash2, Calendar, Info, AlertCircle } from 'lucide-react';
import { FileListItem } from '../types/api';

interface FileListProps {
  files: FileListItem[];
  selectedFileId: number | null;
  onFileSelect: (fileId: number | null) => void;
  onFileDelete: (fileId: number) => void;
  isLoading?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedFileId,
  onFileSelect,
  onFileDelete,
  isLoading = false,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (fileId: number) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setDeletingId(fileId);
      try {
        await onFileDelete(fileId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseMetadata = (metadataString: string) => {
    try {
      return JSON.parse(metadataString);
    } catch {
      return {};
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No files uploaded yet</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">Upload a document to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents ({files.length})</h3>
        <button
          onClick={() => onFileSelect(null)}
          className={`text-xs px-2 py-1 rounded-md transition-colors ${
            selectedFileId === null
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          All Files
        </button>
      </div>

      {files.map((file) => {
        const metadata = parseMetadata(file.file_metadata);
        const isSelected = selectedFileId === file.id;
        const isDeleting = deletingId === file.id;

        return (
          <div
            key={file.id}
            className={`group relative rounded-lg border transition-all duration-200 ${
              isSelected
                ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
            }`}
          >
            <div
              className="p-3 cursor-pointer"
              onClick={() => onFileSelect(file.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className={`mt-0.5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                    }`}>
                      {file.filename}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(file.upload_time)}
                      </div>
                      {metadata.pages && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Info className="h-3 w-3 mr-1" />
                          {metadata.pages} pages
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.id);
                  }}
                  disabled={isDeleting}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all duration-200 ${
                    isDeleting
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  {isDeleting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};