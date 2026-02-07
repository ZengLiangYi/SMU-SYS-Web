import { request } from '@umijs/max';
import type {
  PatientListParams,
  PatientListResult,
  PatientDetail,
  PatientUpdateRequest,
  FollowupListParams,
  FollowupListResult,
  ReferralListResult,
  MedicationRecordListParams,
  MedicationRecordListResult,
  DietRecordListParams,
  DietRecordListResult,
  ExerciseRecordListParams,
  ExerciseRecordListResult,
} from './typings.d';

/**
 * 分页查询患者列表
 */
export async function getPatients(params: PatientListParams) {
  return request<API.ApiResponse<PatientListResult>>(
    '/api/doctor/patients',
    { method: 'GET', params },
  );
}

/**
 * 获取患者详情
 */
export async function getPatient(patientId: string) {
  return request<API.ApiResponse<PatientDetail>>(
    `/api/doctor/patients/${patientId}`,
    { method: 'GET' },
  );
}

/**
 * 更新患者信息
 */
export async function updatePatient(
  patientId: string,
  data: PatientUpdateRequest,
) {
  return request<API.ApiResponse<PatientDetail>>(
    `/api/doctor/patients/${patientId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 分页查询患者随访记录
 */
export async function getFollowups(
  patientId: string,
  params: FollowupListParams,
) {
  return request<API.ApiResponse<FollowupListResult>>(
    `/api/doctor/patients/${patientId}/followups`,
    { method: 'GET', params },
  );
}

/**
 * 查询患者转诊记录（院内 + 院外）
 */
export async function getReferrals(patientId: string) {
  return request<API.ApiResponse<ReferralListResult>>(
    `/api/doctor/patients/${patientId}/referrals`,
    { method: 'GET' },
  );
}

/**
 * 分页查询患者用药记录
 */
export async function getMedicationRecords(
  patientId: string,
  params: MedicationRecordListParams,
) {
  return request<API.ApiResponse<MedicationRecordListResult>>(
    `/api/doctor/patients/${patientId}/medication-records`,
    { method: 'GET', params },
  );
}

/**
 * 分页查询患者饮食记录
 */
export async function getDietRecords(
  patientId: string,
  params: DietRecordListParams,
) {
  return request<API.ApiResponse<DietRecordListResult>>(
    `/api/doctor/patients/${patientId}/diet-records`,
    { method: 'GET', params },
  );
}

/**
 * 分页查询患者运动记录
 */
export async function getExerciseRecords(
  patientId: string,
  params: ExerciseRecordListParams,
) {
  return request<API.ApiResponse<ExerciseRecordListResult>>(
    `/api/doctor/patients/${patientId}/exercise-records`,
    { method: 'GET', params },
  );
}
