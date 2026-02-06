import { request } from '@umijs/max';
import type {
  ConversationListParams,
  ConversationListResult,
  ConversationDetail,
  ConversationCreateRequest,
  MessageListParams,
  MessageListResult,
  MessageListItem,
  MessageSendRequest,
  MediaUploadResponse,
} from './typings.d';

/**
 * 会话列表
 */
export async function getConversations(params: ConversationListParams) {
  return request<API.ApiResponse<ConversationListResult>>(
    '/api/doctor/chat/conversations',
    { method: 'GET', params },
  );
}

/**
 * 创建/获取会话
 */
export async function createConversation(data: ConversationCreateRequest) {
  return request<API.ApiResponse<ConversationDetail>>(
    '/api/doctor/chat/conversations',
    { method: 'POST', data },
  );
}

/**
 * 消息列表
 */
export async function getMessages(
  conversationId: string,
  params: MessageListParams,
) {
  return request<API.ApiResponse<MessageListResult>>(
    `/api/doctor/chat/conversations/${conversationId}/messages`,
    { method: 'GET', params },
  );
}

/**
 * 发送消息
 */
export async function sendMessage(
  conversationId: string,
  data: MessageSendRequest,
) {
  return request<API.ApiResponse<MessageListItem>>(
    `/api/doctor/chat/conversations/${conversationId}/messages`,
    { method: 'POST', data },
  );
}

/**
 * 标记会话已读
 */
export async function markConversationRead(conversationId: string) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/chat/conversations/${conversationId}/read`,
    { method: 'POST' },
  );
}

/**
 * 撤回消息
 */
export async function recallMessage(messageId: string) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/chat/messages/${messageId}/recall`,
    { method: 'POST' },
  );
}

/**
 * 上传聊天媒体文件
 */
export async function uploadChatMedia(file: File, mediaType: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('media_type', mediaType);
  return request<API.ApiResponse<MediaUploadResponse>>(
    '/api/doctor/chat/media/upload',
    { method: 'POST', data: formData },
  );
}
