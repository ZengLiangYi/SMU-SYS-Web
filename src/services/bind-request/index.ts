import { request } from '@umijs/max';
import type {
  BindRequestListParams,
  BindRequestListResult,
  BindRequestItem,
  BindRequestCreateRequest,
} from './typings.d';

/**
 * 绑定请求列表
 */
export async function getBindRequests(params: BindRequestListParams) {
  return request<API.ApiResponse<BindRequestListResult>>(
    '/api/doctor/bind-requests',
    { method: 'GET', params },
  );
}

/**
 * 发起绑定请求
 */
export async function createBindRequest(data: BindRequestCreateRequest) {
  return request<API.ApiResponse<BindRequestItem>>(
    '/api/doctor/bind-requests',
    { method: 'POST', data },
  );
}

/**
 * 撤销绑定请求
 */
export async function cancelBindRequest(requestId: string) {
  return request<API.ApiResponse<BindRequestItem>>(
    `/api/doctor/bind-requests/${requestId}/cancel`,
    { method: 'POST' },
  );
}
