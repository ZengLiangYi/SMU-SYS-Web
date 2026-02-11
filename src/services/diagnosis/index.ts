import { request } from '@umijs/max';
import type {
  DiagnosisCreateResponse,
  DiagnosisDetailResponse,
  DiagnosisHistoryParams,
  DiagnosisHistoryResult,
  DiagnosisRecordListParams,
  DiagnosisRecordListResult,
  DiagnosisUpdateRequest,
} from './typings.d';

/**
 * 获取当前诊疗记录（断点续诊）
 */
export async function getCurrentDiagnosis(patientId: string) {
  return request<API.ApiResponse<DiagnosisDetailResponse>>(
    `/api/doctor/patients/${patientId}/diagnoses/current`,
    { method: 'GET' },
  );
}

/**
 * 创建诊疗记录
 */
export async function createDiagnosis(patientId: string) {
  return request<API.ApiResponse<DiagnosisCreateResponse>>(
    `/api/doctor/patients/${patientId}/diagnoses`,
    { method: 'POST' },
  );
}

/**
 * 更新诊疗记录（分步提交）
 */
export async function updateDiagnosis(
  patientId: string,
  diagnosisId: string,
  data: DiagnosisUpdateRequest,
) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/patients/${patientId}/diagnoses/${diagnosisId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 获取患者诊疗历史
 */
export async function getDiagnosisHistory(
  patientId: string,
  params: DiagnosisHistoryParams,
) {
  return request<API.ApiResponse<DiagnosisHistoryResult>>(
    `/api/doctor/patients/${patientId}/diagnoses`,
    { method: 'GET', params },
  );
}

/**
 * 已完成诊疗列表（支持分类/姓名/医生筛选）
 */
export async function getDiagnosisRecords(params: DiagnosisRecordListParams) {
  return request<API.ApiResponse<DiagnosisRecordListResult>>(
    '/api/doctor/diagnosis-records',
    { method: 'GET', params },
  );
}
