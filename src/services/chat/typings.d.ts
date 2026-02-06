// -------- 会话 --------
export interface ConversationListItem {
  id: string;
  doctor_id: string;
  patient_id: string;
  last_message_id: string | null;
  last_message_at: string | null;
  status: 'active' | 'archived';
  unread_count: number;
}

export interface ConversationListParams {
  offset?: number;
  limit?: number;
}

export interface ConversationListResult {
  total: number;
  offset: number;
  limit: number;
  items: ConversationListItem[];
}

export interface ConversationDetail {
  id: string;
  doctor_id: string;
  patient_id: string;
  last_message_id: string | null;
  last_message_at: string | null;
  status: 'active' | 'archived';
  archived_at: string | null;
  created_at: string;
}

export interface ConversationCreateRequest {
  patient_id: string;
}

// -------- 消息 --------
export type MessageType = 'text' | 'image' | 'audio' | 'video';
export type MessageStatus = 'sent' | 'recalled';
export type SenderRole = 'doctor' | 'patient';

export interface MessageListItem {
  id: string;
  sender_id: string;
  sender_role: SenderRole;
  msg_type: MessageType;
  content: string | null;
  media_url: string | null;
  media_meta: Record<string, any> | null;
  status: MessageStatus;
  created_at: string;
  recalled_at: string | null;
}

export interface MessageListParams {
  offset?: number;
  limit?: number;
}

export interface MessageListResult {
  total: number;
  offset: number;
  limit: number;
  items: MessageListItem[];
}

export interface MessageSendRequest {
  msg_type: MessageType;
  content?: string;
  media_asset_id?: string;
  media_url?: string;
  extra?: Record<string, any>;
}

// -------- 媒体上传 --------
export interface MediaUploadResponse {
  id: string;
  url: string;
  size: number;
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
}
