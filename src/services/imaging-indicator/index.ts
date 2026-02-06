import { request } from '@umijs/max';
import type {
  ImagingIndicator,
  ImagingIndicatorCreateRequest,
  ImagingIndicatorListParams,
  ImagingIndicatorListResult,
  ImagingIndicatorUpdateRequest,
} from './typings.d';

/**
 * 分页查询影像学筛查指标列表
 * @param params { offset, limit }
 */
export async function getImagingIndicators(
  params: ImagingIndicatorListParams,
) {
  return request<API.ApiResponse<ImagingIndicatorListResult>>(
    '/api/doctor/imaging-indicators',
    { method: 'GET', params },
  );
}

/**
 * 创建影像学筛查指标
 * @param data 指标信息
 */
export async function createImagingIndicator(
  data: ImagingIndicatorCreateRequest,
) {
  return request<API.ApiResponse<ImagingIndicator>>(
    '/api/doctor/imaging-indicators',
    { method: 'POST', data },
  );
}

/**
 * 更新影像学筛查指标
 * @param indicatorId 指标 ID
 * @param data 更新字段
 */
export async function updateImagingIndicator(
  indicatorId: string,
  data: ImagingIndicatorUpdateRequest,
) {
  return request<API.ApiResponse<ImagingIndicator>>(
    `/api/doctor/imaging-indicators/${indicatorId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 删除影像学筛查指标
 * @param indicatorId 指标 ID
 */
export async function deleteImagingIndicator(indicatorId: string) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/imaging-indicators/${indicatorId}`,
    { method: 'DELETE' },
  );
}
