import { request } from '@umijs/max';
import type {
  LlmScreeningRequest,
  LlmScreeningResponse,
  LlmDiseaseJudgementRequest,
  LlmDiseaseJudgementResponse,
  LlmPrescriptionRequest,
  LlmPrescriptionResponse,
} from './typings.d';

/**
 * 生成检查项目建议
 */
export async function getScreeningRecommendation(data: LlmScreeningRequest) {
  return request<API.ApiResponse<LlmScreeningResponse>>(
    '/api/doctor/llm/screening-items',
    { method: 'POST', data },
  );
}

/**
 * 判断患者可能病症
 */
export async function getDiseaseJudgement(data: LlmDiseaseJudgementRequest) {
  return request<API.ApiResponse<LlmDiseaseJudgementResponse>>(
    '/api/doctor/llm/disease-judgement',
    { method: 'POST', data },
  );
}

/**
 * 生成处方建议
 */
export async function getPrescriptionRecommendation(
  data: LlmPrescriptionRequest,
) {
  return request<API.ApiResponse<LlmPrescriptionResponse>>(
    '/api/doctor/llm/prescription',
    { method: 'POST', data },
  );
}
