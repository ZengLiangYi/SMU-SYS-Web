import { request } from '@umijs/max';
import type {
  NotificationListParams,
  NotificationListResult,
  NotificationReadParams,
  NotificationReadResult,
} from './typings.d';

/**
 * 分页查询通知列表
 * @param params { offset, limit, status?, biz_type?, biz_id? }
 */
export async function getNotifications(params: NotificationListParams) {
  return request<API.ApiResponse<NotificationListResult>>(
    '/api/doctor/notifications',
    { method: 'GET', params },
  );
}

/**
 * 批量标记通知已读
 * @param data { ids?, read_all? }
 */
export async function markNotificationsRead(data: NotificationReadParams) {
  return request<API.ApiResponse<NotificationReadResult>>(
    '/api/doctor/notifications/read',
    { method: 'POST', data },
  );
}
