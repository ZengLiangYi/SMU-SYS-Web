import { request } from '@umijs/max';
import type {
  InitialDiagnosisUpdateRequest,
  DiagnosisRecordListParams,
  DiagnosisRecordListResult,
} from './typings.d';

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
