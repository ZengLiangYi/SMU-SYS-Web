import { request } from '@umijs/max';
import type {
  DiagnosticScaleCreateRequest,
  DiagnosticScaleDetail,
  DiagnosticScaleListParams,
  DiagnosticScaleListResult,
  DiagnosticScaleUpdateRequest,
} from './typings.d';

/**
 * 分页查询诊断量表列表
 * @param params { offset, limit }
 */
export async function getDiagnosticScales(params: DiagnosticScaleListParams) {
  return request<API.ApiResponse<DiagnosticScaleListResult>>(
    '/api/doctor/diagnostic-scales',
    { method: 'GET', params },
  );
}

/**
 * 获取诊断量表详情（含题目列表）
 * @param scaleId 量表 ID
 */
export async function getDiagnosticScaleDetail(scaleId: string) {
  return request<API.ApiResponse<DiagnosticScaleDetail>>(
    `/api/doctor/diagnostic-scales/${scaleId}`,
    { method: 'GET' },
  );
}

/**
 * 创建诊断量表
 * @param data 量表信息（含题目）
 */
export async function createDiagnosticScale(
  data: DiagnosticScaleCreateRequest,
) {
  return request<API.ApiResponse<DiagnosticScaleDetail>>(
    '/api/doctor/diagnostic-scales',
    { method: 'POST', data },
  );
}

/**
 * 更新诊断量表
 * @param scaleId 量表 ID
 * @param data 更新字段
 */
export async function updateDiagnosticScale(
  scaleId: string,
  data: DiagnosticScaleUpdateRequest,
) {
  return request<API.ApiResponse<DiagnosticScaleDetail>>(
    `/api/doctor/diagnostic-scales/${scaleId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 删除诊断量表（软删除）
 * @param scaleId 量表 ID
 */
export async function deleteDiagnosticScale(scaleId: string) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/diagnostic-scales/${scaleId}`,
    { method: 'DELETE' },
  );
}
