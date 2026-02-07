import type { MessageListItem } from '../chat/typings.d';
import type { NotificationItem } from '../notification/typings.d';

// -------- 事件 envelope --------
export interface SocketEventEnvelope<T = unknown> {
  type: string;
  data: T;
  ts: string;
}

// -------- 各事件 data 类型 --------
export interface ConnectionReadyData {
  role: 'doctor' | 'patient';
  user_id: string;
}

export interface MessageNewData {
  conversation_id: string;
  message: MessageListItem;
}

export type NotificationNewData = NotificationItem;

export interface SystemErrorData {
  code: string;
  message: string;
}

// -------- 事件类型映射 --------
export interface SocketEventMap {
  'connection:ready': SocketEventEnvelope<ConnectionReadyData>;
  'message:new': SocketEventEnvelope<MessageNewData>;
  'notification:new': SocketEventEnvelope<NotificationNewData>;
  'system:error': SocketEventEnvelope<SystemErrorData>;
}

export type SocketEventType = keyof SocketEventMap;
