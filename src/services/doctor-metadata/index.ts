import { request } from '@umijs/max';
import type { DiseaseMetaItem, DoctorMetaItem } from './typings.d';

/**
 * 获取可用医生元数据（医生角色可用）
 */
export async function getDoctorMetadata() {
  return request<API.ApiResponse<DoctorMetaItem[]>>(
    '/api/doctor/metadata/doctors',
    { method: 'GET' },
  );
}

/**
 * 获取疾病元数据（医生角色可用）
 */
export async function getDiseaseMetadata() {
  return request<API.ApiResponse<DiseaseMetaItem[]>>(
    '/api/doctor/metadata/diseases',
    { method: 'GET' },
  );
}
