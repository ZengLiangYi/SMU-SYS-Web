import { request } from '@umijs/max';
import type {
  RehabLevel,
  RehabLevelCreateRequest,
  RehabLevelListParams,
  RehabLevelListResult,
  RehabLevelUpdateRequest,
} from './typings.d';

/**
 * 分页查询康复训练关卡
 * @param params { offset, limit, level_type?, name? }
 */
export async function getRehabLevels(params: RehabLevelListParams) {
  return request<API.ApiResponse<RehabLevelListResult>>(
    '/api/doctor/rehab-levels',
    { method: 'GET', params },
  );
}

/**
 * 创建康复训练关卡
 * @param data 关卡信息
 */
export async function createRehabLevel(data: RehabLevelCreateRequest) {
  return request<API.ApiResponse<RehabLevel>>('/api/doctor/rehab-levels', {
    method: 'POST',
    data,
  });
}

/**
 * 更新康复训练关卡
 * @param levelId 关卡 ID
 * @param data 更新字段
 */
export async function updateRehabLevel(
  levelId: string,
  data: RehabLevelUpdateRequest,
) {
  return request<API.ApiResponse<RehabLevel>>(
    `/api/doctor/rehab-levels/${levelId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 删除康复训练关卡
 * @param levelId 关卡 ID
 */
export async function deleteRehabLevel(levelId: string) {
  return request<API.ApiResponse<null>>(`/api/doctor/rehab-levels/${levelId}`, {
    method: 'DELETE',
  });
}
