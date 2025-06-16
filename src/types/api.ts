export interface FileListItem {
  id: number;
  filename: string;
  upload_time: string;
  file_metadata: string;
}

export interface FileUploadResponse {
  id: number;
  filename: string;
}

export interface ChatRequest {
  question: string;
  file_id?: number | null;
  keywords?: string[] | null;
  metadata_filter?: Record<string, any> | null;
  k?: number | null;
}

export interface ChatResponse {
  answer: string;
  sources: any[];
}

export interface AdminClearAllResponse {
  status: string;
  files_deleted: number;
  chats_deleted: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: any[];
  file_id?: number;
}