import { request } from '@umijs/max';
import type {
  Medicine,
  MedicineCreateRequest,
  MedicineListParams,
  MedicineListResult,
  MedicineUpdateRequest,
} from './typings.d';

/**
 * 分页查询药物列表
 * @param params { offset, limit, treatment_type?, name? }
 */
export async function getMedicines(params: MedicineListParams) {
  return request<API.ApiResponse<MedicineListResult>>(
    '/api/doctor/medicines',
    { method: 'GET', params },
  );
}

/**
 * 创建药物
 * @param data 药物信息
 */
export async function createMedicine(data: MedicineCreateRequest) {
  return request<API.ApiResponse<Medicine>>('/api/doctor/medicines', {
    method: 'POST',
    data,
  });
}

/**
 * 更新药物
 * @param medicineId 药物 ID
 * @param data 更新字段
 */
export async function updateMedicine(
  medicineId: string,
  data: MedicineUpdateRequest,
) {
  return request<API.ApiResponse<Medicine>>(
    `/api/doctor/medicines/${medicineId}`,
    { method: 'PATCH', data },
  );
}

/**
 * 删除药物
 * @param medicineId 药物 ID
 */
export async function deleteMedicine(medicineId: string) {
  return request<API.ApiResponse<null>>(
    `/api/doctor/medicines/${medicineId}`,
    { method: 'DELETE' },
  );
}
