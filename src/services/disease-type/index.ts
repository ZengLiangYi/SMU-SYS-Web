import { request } from '@umijs/max';
import type {
  DiseaseType,
  DiseaseTypeCreateRequest,
  DiseaseTypeListParams,
  DiseaseTypeListResult,
  DiseaseTypeUpdateRequest,
} from './typings.d';

/**
 * 分页查询疾病类型
 * @param params { offset, limit, disease_category?, disease_name? }
 */
export async function getDiseaseTypes(params: DiseaseTypeListParams) {
  return request<API.ApiResponse<DiseaseTypeListResult>>(
    '/api/doctor/disease-types',
    { method: 'GET', params },
  );
}

/**
 * 创建疾病类型
 * @param data 疾病类型信息
 */
export async function createDiseaseType(data: DiseaseTypeCreateRequest) {
  return request<API.ApiResponse<DiseaseType>>('/api/doctor/disease-types', {
    method: 'POST',
    data,
  });
}

/**
 * 更新疾病类型
 * @param diseaseTypeId 疾病类型 ID
 * @param data 更新字段
 */
export async function updateDiseaseType(
  diseaseTypeId: string,
  data: DiseaseTypeUpdateRequest,
) {
  return request<API.ApiResponse<DiseaseType>>(
    `/api/doctor/disease-types/${diseaseTypeId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 删除疾病类型
 * @param diseaseTypeId 疾病类型 ID
 */
export async function deleteDiseaseType(diseaseTypeId: string) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/disease-types/${diseaseTypeId}`,
    { method: 'DELETE' },
  );
}
