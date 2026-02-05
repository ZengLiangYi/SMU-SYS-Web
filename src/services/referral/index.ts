import { request } from '@umijs/max';
import type {
  Referral,
  ReferralCreateRequest,
  ReferralListParams,
  ReferralListResult,
  ReferralUpdateRequest,
} from './typings.d';

/**
 * 分页查询转诊医生
 * @param params { offset, limit, hospital_name?, doctor_name? }
 */
export async function getReferrals(params: ReferralListParams) {
  return request<API.ApiResponse<ReferralListResult>>(
    '/api/doctor/referrals',
    { method: 'GET', params },
  );
}

/**
 * 创建转诊医生
 * @param data 转诊医生信息
 */
export async function createReferral(data: ReferralCreateRequest) {
  return request<API.ApiResponse<Referral>>('/api/doctor/referrals', {
    method: 'POST',
    data,
  });
}

/**
 * 更新转诊医生
 * @param referralId 转诊医生 ID
 * @param data 更新字段
 */
export async function updateReferral(
  referralId: string,
  data: ReferralUpdateRequest,
) {
  return request<API.ApiResponse<Referral>>(
    `/api/doctor/referrals/${referralId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 删除转诊医生
 * @param referralId 转诊医生 ID
 */
export async function deleteReferral(referralId: string) {
  return request<API.ApiResponse<null>>(`/api/doctor/referrals/${referralId}`, {
    method: 'DELETE',
  });
}
