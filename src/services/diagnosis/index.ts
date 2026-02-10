import { request } from '@umijs/max';
import type {
  InitialDiagnosisDetailResponse,
  InitialDiagnosisUpdateRequest,
  DiagnosisRecordListParams,
  DiagnosisRecordListResult,
} from './typings.d';

/**
 * 获取初诊全量信息（断点续诊）
 */
export async function getInitialDiagnosis(patientId: string) {
  return request<API.ApiResponse<InitialDiagnosisDetailResponse>>(
    `/api/doctor/patients/${patientId}/initial-diagnosis`,
    { method: 'GET' },
  );
}

/**
 * 更新初诊信息（分步提交）
 */
export async function updateInitialDiagnosis(
  patientId: string,
  data: InitialDiagnosisUpdateRequest,
) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/patients/${patientId}/initial-diagnosis`,
    { method: 'PUT', data },
  );
}

/**
 * 诊疗列表（支持分类/姓名/医生筛选）
 */
export async function getDiagnosisRecords(params: DiagnosisRecordListParams) {
  return request<API.ApiResponse<DiagnosisRecordListResult>>(
    '/api/doctor/diagnosis-records',
    { method: 'GET', params },
  );
}
