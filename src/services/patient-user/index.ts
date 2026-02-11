import { request } from '@umijs/max';
import type {
  PatientListParams,
  PatientListResult,
  PatientDetail,
  PatientUpdateRequest,
  FollowupListParams,
  FollowupListResult,
  FollowupCreateRequest,
  FollowupListItem,
  ReferralListResult,
  InternalReferralListResult,
  ExternalReferralListResult,
  PatientReferralCreateRequest,
  PatientReferralCreateResponse,
  MedicationRecordListParams,
  MedicationRecordListResult,
  DietRecordListParams,
  DietRecordListResult,
  ExerciseRecordListParams,
  ExerciseRecordListResult,
  PatientAnalysisParams,
  PatientHealthAnalysis,
  ScaleScoreResult,
  HealthMetricListParams,
  HealthMetricListResult,
  RehabScoreRecordListParams,
  RehabScoreRecordListResult,
  RehabScoreRecordDetail,
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
 * 创建患者随访记录
 */
export async function createFollowup(
  patientId: string,
  data: FollowupCreateRequest,
) {
  return request<API.ApiResponse<FollowupListItem>>(
    `/api/doctor/patients/${patientId}/followups`,
    { method: 'POST', data },
  );
}

/**
 * @deprecated 使用 getInternalReferrals / getExternalReferrals 代替
 */
export async function getReferrals(patientId: string) {
  return request<API.ApiResponse<ReferralListResult>>(
    `/api/doctor/patients/${patientId}/referrals`,
    { method: 'GET' },
  );
}

/**
 * 分页查询患者院内转诊记录
 */
export async function getInternalReferrals(
  patientId: string,
  params: FollowupListParams,
) {
  return request<API.ApiResponse<InternalReferralListResult>>(
    `/api/doctor/patients/${patientId}/referrals/internal`,
    { method: 'GET', params },
  );
}

/**
 * 分页查询患者院外转诊记录
 */
export async function getExternalReferrals(
  patientId: string,
  params: FollowupListParams,
) {
  return request<API.ApiResponse<ExternalReferralListResult>>(
    `/api/doctor/patients/${patientId}/referrals/external`,
    { method: 'GET', params },
  );
}

/**
 * 创建患者转诊记录（院内/院外）
 */
export async function createReferral(
  patientId: string,
  data: PatientReferralCreateRequest,
) {
  return request<API.ApiResponse<PatientReferralCreateResponse>>(
    `/api/doctor/patients/${patientId}/referrals`,
    { method: 'POST', data },
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

/**
 * 获取患者健康分析数据
 */
export async function getPatientAnalysis(
  patientId: string,
  params?: PatientAnalysisParams,
) {
  return request<API.ApiResponse<PatientHealthAnalysis>>(
    `/api/doctor/patients/${patientId}/analysis`,
    { method: 'GET', params },
  );
}

/**
 * 获取患者量表分数
 */
export async function getScaleScores(patientId: string) {
  return request<API.ApiResponse<ScaleScoreResult>>(
    `/api/doctor/patients/${patientId}/scale-scores`,
    { method: 'GET' },
  );
}

/**
 * 分页查询患者健康指标记录
 */
export async function getHealthMetrics(
  patientId: string,
  params: HealthMetricListParams,
) {
  return request<API.ApiResponse<HealthMetricListResult>>(
    `/api/doctor/patients/${patientId}/health-metrics`,
    { method: 'GET', params },
  );
}

/**
 * 分页查询患者康复评分记录
 */
export async function getRehabScoreRecords(
  patientId: string,
  params: RehabScoreRecordListParams,
) {
  return request<API.ApiResponse<RehabScoreRecordListResult>>(
    `/api/doctor/patients/${patientId}/rehab-score-records`,
    { method: 'GET', params },
  );
}

/**
 * 获取患者康复评分记录详情
 */
export async function getRehabScoreRecordDetail(
  patientId: string,
  recordId: string,
) {
  return request<API.ApiResponse<RehabScoreRecordDetail>>(
    `/api/doctor/patients/${patientId}/rehab-score-records/${recordId}`,
    { method: 'GET' },
  );
}
