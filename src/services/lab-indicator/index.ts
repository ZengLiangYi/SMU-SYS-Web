import { request } from '@umijs/max';
import type {
  LabIndicator,
  LabIndicatorCreateRequest,
  LabIndicatorListParams,
  LabIndicatorListResult,
  LabIndicatorMetaItem,
  LabIndicatorUpdateRequest,
} from './typings.d';

/**
 * 分页查询实验室筛查指标列表
 * @param params { offset, limit }
 */
export async function getLabIndicators(params: LabIndicatorListParams) {
  return request<API.ApiResponse<LabIndicatorListResult>>(
    '/api/doctor/lab-indicators',
    { method: 'GET', params },
  );
}

/**
 * 创建实验室筛查指标
 * @param data 指标信息
 */
export async function createLabIndicator(data: LabIndicatorCreateRequest) {
  return request<API.ApiResponse<LabIndicator>>(
    '/api/doctor/lab-indicators',
    { method: 'POST', data },
  );
}

/**
 * 更新实验室筛查指标
 * @param indicatorId 指标 ID
 * @param data 更新字段
 */
export async function updateLabIndicator(
  indicatorId: string,
  data: LabIndicatorUpdateRequest,
) {
  return request<API.ApiResponse<LabIndicator>>(
    `/api/doctor/lab-indicators/${indicatorId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 获取实验室筛查元数据（轻量列表，仅 id + name）
 * @param params 可选过滤：id 精确匹配，keyword 模糊搜索
 */
export async function getLabIndicatorMeta(
  params?: { id?: string; keyword?: string },
) {
  return request<API.ApiResponse<LabIndicatorMetaItem[]>>(
    '/api/doctor/metadata/lab-indicators',
    { method: 'GET', params },
  );
}

/**
 * 删除实验室筛查指标
 * @param indicatorId 指标 ID
 */
export async function deleteLabIndicator(indicatorId: string) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/lab-indicators/${indicatorId}`,
    { method: 'DELETE' },
  );
}
