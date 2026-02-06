// 通知列表项
export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  status: 'unread' | 'read' | 'revoked';
  biz_type: string | null;
  biz_id: string | null;
  created_at: string;
  read_at: string | null;
  extra: Record<string, any> | null;
}

// 列表查询参数
export interface NotificationListParams {
  offset?: number;
  limit?: number;
  status?: 'unread' | 'read' | 'revoked';
  biz_type?: string;
  biz_id?: string;
}

// 列表响应
export interface NotificationListResult {
  total: number;
  offset: number;
  limit: number;
  items: NotificationItem[];
}

// 批量已读请求
export interface NotificationReadParams {
  ids?: string[];
  read_all?: boolean;
}

// 批量已读响应
export interface NotificationReadResult {
  updated: number;
}
